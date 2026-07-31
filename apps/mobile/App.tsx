import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type {
  BlieChatResponse,
  DashboardSummary,
  DocumentLibrarySummary,
  HealthStatus,
  LearningDocument,
  PlkgNode,
  PlkgSummary,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
  SyncStatusSummary,
} from "@sbud-d/types";

import { signInWithPassword, signOut } from "./src/auth/auth-service";
import { fallbackBlieResponse, sendBlieChat } from "./src/blie/blie-service";
import { getApiBaseUrl } from "./src/config/environment";
import { fallbackDashboardSummary, fetchDashboardSummary } from "./src/dashboard/dashboard-service";
import {
  createLearningDocument,
  extractLearningDocumentText,
  fallbackDocumentLibrarySummary,
  fetchDocumentLibrarySummary,
  mapLearningDocumentConcepts,
  uploadSamplePdfDocument,
} from "./src/documents/document-service";
import { fallbackHealthStatus, fetchHealthStatus } from "./src/health/health-service";
import { setApiAccessToken } from "./src/lib/api-client";
import {
  createPlkgLearningActivity,
  fallbackPlkgSummary,
  fetchPlkgSummary,
} from "./src/plkg/plkg-service";
import {
  createStudyReflection,
  fallbackStudySummary,
  fetchStudySummary,
} from "./src/study/study-service";
import {
  cacheLearningSnapshot,
  enqueueOfflineChange,
  getOfflineStorageStatus,
  fallbackSyncStatus,
  fetchSyncStatus,
  getLearningSnapshot,
  getLocalSyncStatus,
  hydrateOfflineState,
  pushPendingQueue,
} from "./src/sync/sync-service";

type TabKey = "dashboard" | "study" | "buddy" | "library" | "plkg" | "sync";
type FeedbackTone = "neutral" | "success" | "warning" | "error";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "study", label: "Study" },
  { key: "buddy", label: "BLIE" },
  { key: "library", label: "Library" },
  { key: "plkg", label: "PLKG" },
  { key: "sync", label: "Sync" },
];

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardSummary>(fallbackDashboardSummary);
  const [documentLibrary, setDocumentLibrary] = useState<DocumentLibrarySummary>(
    fallbackDocumentLibrarySummary,
  );
  const [plkgSummary, setPlkgSummary] = useState<PlkgSummary>(fallbackPlkgSummary);
  const [studySummary, setStudySummary] = useState<StudySummary>(fallbackStudySummary);
  const [syncStatus, setSyncStatus] = useState<SyncStatusSummary>(fallbackSyncStatus);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(fallbackHealthStatus);
  const [apiStatus, setApiStatus] = useState("Loading dashboard...");
  const [runtimeStatus, setRuntimeStatus] = useState("Checking API runtime...");
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("Not signed in");
  const [signedInUserLabel, setSignedInUserLabel] = useState<string | null>(null);
  const [libraryStatus, setLibraryStatus] = useState("Loading library...");
  const [plkgStatus, setPlkgStatus] = useState("Loading PLKG...");
  const [studyStatus, setStudyStatus] = useState("Loading study guidance...");
  const [syncStatusLabel, setSyncStatusLabel] = useState("Checking sync status...");
  const [offlineStorageLabel, setOfflineStorageLabel] = useState(getOfflineStorageStatus().label);
  const [uploadState, setUploadState] = useState("Ready for metadata upload");
  const [blieQuestion, setBlieQuestion] = useState("Explain recursion with a simple example");
  const [blieStatus, setBlieStatus] = useState("Ready for context-aware chat");
  const [blieResponse, setBlieResponse] = useState<BlieChatResponse | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const primarySubject = dashboard.subjects[0] ?? null;
  const nextPreparation = studySummary.preparationPlans[0] ?? null;
  const priorityRevision = studySummary.revisionItems[0] ?? null;
  const priorityGap = plkgSummary.knowledgeGaps[0] ?? null;
  const runtime = healthStatus.runtime ?? fallbackHealthStatus.runtime;
  const studentContextLabel = `${dashboard.academicOverview.currentSemester.label} - ${dashboard.academicOverview.programmeName}`;
  const hasSubjects = dashboard.subjects.length > 0;
  const hasDocuments = documentLibrary.documents.length > 0;
  const hasExtractedText = documentLibrary.documents.some((document) =>
    Boolean(document.extractedText),
  );
  const hasMappedConcepts = documentLibrary.documents.some(
    (document) => document.extractedConcepts.length > 0,
  );
  const hasBlieLearningOutput =
    Boolean(blieResponse?.response.preparationPriorities.length) ||
    Boolean(blieResponse?.response.quickQuiz.questions.length);
  const journeyProgress = [
    {
      done: hasDocuments,
      label: "Upload",
      value: hasDocuments ? "Material captured" : "Add lecture PDF",
    },
    {
      done: hasExtractedText,
      label: "Extract",
      value: hasExtractedText ? "Readable text ready" : "Extract text",
    },
    {
      done: hasMappedConcepts,
      label: "Connect",
      value: hasMappedConcepts ? "PLKG enriched" : "Map concepts",
    },
    {
      done: hasBlieLearningOutput,
      label: "Practice",
      value: hasBlieLearningOutput ? "Quiz ready" : "Ask BLIE",
    },
  ];

  useEffect(() => {
    let isMounted = true;

    hydrateOfflineState()
      .then((storageStatus) => {
        if (isMounted) {
          const cachedSnapshot = getLearningSnapshot();

          setOfflineStorageLabel(storageStatus.label);
          setSyncStatus(getLocalSyncStatus());

          if (cachedSnapshot.dashboard) {
            setDashboard(cachedSnapshot.dashboard);
            setApiStatus("Restored cached dashboard");
          }

          if (cachedSnapshot.documentLibrary) {
            setDocumentLibrary(cachedSnapshot.documentLibrary);
            setLibraryStatus("Restored cached library");
          }

          if (cachedSnapshot.plkgSummary) {
            setPlkgSummary(cachedSnapshot.plkgSummary);
            setPlkgStatus("Restored cached PLKG");
          }

          if (cachedSnapshot.studySummary) {
            setStudySummary(cachedSnapshot.studySummary);
            setStudyStatus("Restored cached study plan");
          }

          if (cachedSnapshot.blieResponse) {
            setBlieResponse(cachedSnapshot.blieResponse);
            setBlieStatus("Restored cached BLIE response");
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setOfflineStorageLabel("Offline cache unavailable");
        }
      });

    fetchHealthStatus()
      .then((status) => {
        if (isMounted) {
          setHealthStatus(status);
          setRuntimeStatus("API runtime connected");
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealthStatus(fallbackHealthStatus);
          setRuntimeStatus("API runtime unavailable");
        }
      });

    fetchDashboardSummary()
      .then((summary) => {
        if (isMounted) {
          setDashboard(summary);
          setApiStatus("Connected to API");
          setSelectedSubjectId(summary.subjects[0]?.id ?? null);
          cacheLearningSnapshot({ dashboard: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedDashboard = getLearningSnapshot().dashboard;

          setDashboard(cachedDashboard ?? fallbackDashboardSummary);
          setApiStatus(cachedDashboard ? "Using cached dashboard" : "Using offline fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchDocumentLibrarySummary()
      .then((summary) => {
        if (isMounted) {
          setDocumentLibrary(summary);
          setLibraryStatus("Connected to document API");
          cacheLearningSnapshot({ documentLibrary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedLibrary = getLearningSnapshot().documentLibrary;

          setDocumentLibrary(cachedLibrary ?? fallbackDocumentLibrarySummary);
          setLibraryStatus(
            cachedLibrary ? "Using cached library" : "Using offline library fallback",
          );
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchPlkgSummary()
      .then((summary) => {
        if (isMounted) {
          setPlkgSummary(summary);
          setPlkgStatus("Connected to PLKG API");
          cacheLearningSnapshot({ plkgSummary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedPlkg = getLearningSnapshot().plkgSummary;

          setPlkgSummary(cachedPlkg ?? fallbackPlkgSummary);
          setPlkgStatus(cachedPlkg ? "Using cached PLKG" : "Using offline PLKG fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchStudySummary()
      .then((summary) => {
        if (isMounted) {
          setStudySummary(summary);
          setStudyStatus("Connected to study API");
          cacheLearningSnapshot({ studySummary: summary });
        }
      })
      .catch(() => {
        if (isMounted) {
          const cachedStudy = getLearningSnapshot().studySummary;

          setStudySummary(cachedStudy ?? fallbackStudySummary);
          setStudyStatus(cachedStudy ? "Using cached study plan" : "Using offline study fallback");
          setSyncStatus(getLocalSyncStatus());
        }
      });

    fetchSyncStatus()
      .then((status) => {
        if (isMounted) {
          setSyncStatus(status);
          setSyncStatusLabel("Connected to sync API");
        }
      })
      .catch(() => {
        if (isMounted) {
          setSyncStatus(getLocalSyncStatus());
          setSyncStatusLabel("Using local sync queue");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dataRefreshKey]);

  const refreshLiveData = (): void => {
    setDataRefreshKey((current) => current + 1);
  };

  const handleSignIn = async (): Promise<void> => {
    setAuthStatus("Signing in...");

    try {
      const { data, error } = await signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error || !data.session?.access_token) {
        throw error ?? new Error("Supabase did not return a session.");
      }

      setApiAccessToken(data.session.access_token);
      setSignedInUserLabel(data.user?.email ?? data.user?.id ?? "Authenticated test user");
      setAuthStatus("Signed in for live API validation");
      setAuthPassword("");
      refreshLiveData();
    } catch {
      setApiAccessToken(null);
      setSignedInUserLabel(null);
      setAuthStatus("Sign-in failed; check local Supabase config and test credentials");
      refreshLiveData();
    }
  };

  const handleSignOut = async (): Promise<void> => {
    setAuthStatus("Signing out...");

    try {
      await signOut();
    } finally {
      setApiAccessToken(null);
      setSignedInUserLabel(null);
      setAuthStatus("Signed out");
      refreshLiveData();
    }
  };

  const handleCreateDocument = async (): Promise<void> => {
    setUploadState("Uploading sample PDF through API...");

    try {
      const subjectId = dashboard.subjects[0]?.id ?? "subject-programming";
      const document = await uploadSamplePdfDocument({
        subjectId,
        topicLabel: dashboard.subjects[0]?.currentTopic ?? "Topic pending",
      });

      setDocumentLibrary((current) => ({
        ...current,
        documents: [document, ...current.documents],
      }));
      setUploadState("PDF uploaded and queued for extraction");
    } catch {
      try {
        const document = await createLearningDocument({
          subjectId: dashboard.subjects[0]?.id ?? "subject-programming",
          fileName: "sample-study-note.pdf",
          mimeType: "application/pdf",
          fileSizeBytes: 2048,
          topicLabel: dashboard.subjects[0]?.currentTopic ?? "Topic pending",
        });

        setDocumentLibrary((current) => ({
          ...current,
          documents: [document, ...current.documents],
        }));
        setUploadState("API upload unavailable; metadata fallback created");
      } catch {
        const item = enqueueOfflineChange("document_metadata", "sample-study-note.pdf", {
          fileName: "sample-study-note.pdf",
          subjectId: dashboard.subjects[0]?.id ?? "subject-programming",
        });

        setSyncStatus(getLocalSyncStatus());
        setUploadState(`Queued offline metadata: ${item.id}`);
      }
    }
  };

  const handleSendBlieQuestion = async (): Promise<void> => {
    setBlieStatus("Thinking with retrieved context...");

    try {
      const response = await sendBlieChat({
        message: blieQuestion,
        subjectId: selectedSubjectId,
        preferredMode: "simple",
      });

      setBlieResponse(response);
      setBlieStatus("Learning response ready");
      cacheLearningSnapshot({ blieResponse: response });
    } catch {
      const cachedBlieResponse = getLearningSnapshot().blieResponse;

      setBlieResponse(cachedBlieResponse ?? fallbackBlieResponse);
      setBlieStatus(cachedBlieResponse ? "Using cached BLIE response" : "BLIE request failed");
    }
  };

  const handleExtractDocumentText = async (documentId: string): Promise<void> => {
    setUploadState("Extracting readable PDF text...");

    try {
      const document = await extractLearningDocumentText(documentId);

      setDocumentLibrary((current) => ({
        ...current,
        documents: current.documents.map((item) => (item.id === document.id ? document : item)),
      }));
      setUploadState("Readable text extracted. Concept extraction is next.");
    } catch {
      setUploadState("Text extraction failed; try again when the API is reachable");
    }
  };

  const handleMapDocumentConcepts = async (documentId: string): Promise<void> => {
    setUploadState("Mapping concepts into your PLKG...");

    try {
      const document = await mapLearningDocumentConcepts(documentId);
      const summary = await fetchPlkgSummary();

      setDocumentLibrary((current) => ({
        ...current,
        documents: current.documents.map((item) => (item.id === document.id ? document : item)),
      }));
      setPlkgSummary(summary);
      setPlkgStatus("Document concepts added to PLKG");
      setUploadState("Concepts mapped to your PLKG.");
    } catch {
      setUploadState("Concept mapping failed; try again when the API is reachable");
    }
  };

  const handleAddLearningActivity = async (): Promise<void> => {
    setPlkgStatus("Adding learning activity...");

    try {
      await createPlkgLearningActivity({
        subjectId: selectedSubjectId ?? dashboard.subjects[0]?.id ?? null,
        label: "Reviewed BLIE explanation",
        description: "Student reviewed one BLIE explanation and added it to PLKG memory.",
        sourceId: blieResponse?.id ?? "mobile-plkg-action",
      });
      const summary = await fetchPlkgSummary();

      setPlkgSummary(summary);
      setPlkgStatus("Learning activity added");
    } catch {
      const item = enqueueOfflineChange("plkg_learning_activity", "mobile-plkg-action", {
        label: "Reviewed BLIE explanation",
        subjectId: selectedSubjectId ?? dashboard.subjects[0]?.id ?? null,
        sourceId: blieResponse?.id ?? "mobile-plkg-action",
      });

      setSyncStatus(getLocalSyncStatus());
      setPlkgStatus(`Queued offline PLKG activity: ${item.id}`);
    }
  };

  const handleStudyReflection = async (revisionItem: StudyRevisionItem): Promise<void> => {
    setStudyStatus("Recording revision reflection...");

    try {
      const updated = await createStudyReflection({
        revisionItemId: revisionItem.id,
        confidenceLevel: 75,
        reflection: `Reviewed ${revisionItem.topicLabel} from the mobile Study tab.`,
      });

      setStudySummary((current) => ({
        ...current,
        revisionItems: current.revisionItems.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      }));
      setStudyStatus("Revision reflection recorded");
    } catch {
      const item = enqueueOfflineChange("study_reflection", revisionItem.id, {
        confidenceLevel: 75,
        reflection: `Reviewed ${revisionItem.topicLabel} from the mobile Study tab.`,
      });

      setSyncStatus(getLocalSyncStatus());
      setStudyStatus(`Queued offline reflection: ${item.id}`);
    }
  };

  const handleSyncNow = async (): Promise<void> => {
    setSyncStatusLabel("Synchronizing pending changes...");

    try {
      await pushPendingQueue();
      const status = await fetchSyncStatus();

      setSyncStatus(status);
      setSyncStatusLabel("Sync complete");
    } catch {
      setSyncStatus(getLocalSyncStatus());
      setSyncStatusLabel("Sync failed; pending changes preserved locally");
    }
  };

  const getValidationLabel = (): string => {
    const validationLabel =
      runtime?.liveValidationStatus === "ready_for_authenticated_validation"
        ? "Ready for authenticated RLS validation"
        : runtime?.liveValidationStatus === "supabase_configuration_missing"
          ? "Supabase configuration incomplete"
          : "Fixture mode active";

    return validationLabel;
  };

  const getFeedbackTone = (label: string): FeedbackTone => {
    const normalized = label.toLowerCase();

    if (
      normalized.includes("failed") ||
      normalized.includes("unavailable") ||
      normalized.includes("blocker")
    ) {
      return "error";
    }

    if (
      normalized.includes("offline") ||
      normalized.includes("fallback") ||
      normalized.includes("queued") ||
      normalized.includes("cached")
    ) {
      return "warning";
    }

    if (
      normalized.includes("connected") ||
      normalized.includes("ready") ||
      normalized.includes("complete") ||
      normalized.includes("recorded") ||
      normalized.includes("mapped") ||
      normalized.includes("extracted")
    ) {
      return "success";
    }

    return "neutral";
  };

  const renderFeedback = (label: string): React.JSX.Element => {
    const tone = getFeedbackTone(label);

    return (
      <View style={[styles.feedbackStrip, styles[`${tone}Feedback`]]}>
        <Text style={[styles.feedbackText, styles[`${tone}FeedbackText`]]}>{label}</Text>
      </View>
    );
  };

  const renderActionState = (input: {
    actionLabel?: string;
    body: string;
    onPress?: () => void;
    title: string;
  }): React.JSX.Element => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{input.title}</Text>
      <Text style={styles.mutedText}>{input.body}</Text>
      {input.onPress && input.actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={input.onPress}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>{input.actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const renderJourneyProgress = (): React.JSX.Element => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>True MVP learning loop</Text>
      <Text style={styles.mutedText}>
        Follow the path from lecture material to PLKG memory, BLIE preparation, and quiz practice.
      </Text>
      <View style={styles.journeyGrid}>
        {journeyProgress.map((step) => (
          <View key={step.label} style={[styles.journeyStep, step.done && styles.doneJourneyStep]}>
            <Text style={[styles.journeyLabel, step.done && styles.doneJourneyLabel]}>
              {step.label}
            </Text>
            <Text style={[styles.journeyValue, step.done && styles.doneJourneyValue]}>
              {step.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRuntimeStatus = (): React.JSX.Element => {
    return (
      <View style={styles.statusPanel}>
        <Text style={styles.statusLabel}>API runtime</Text>
        <Text style={styles.statusValue}>{runtime?.persistenceLabel ?? "Runtime pending"}</Text>
        <Text style={styles.statusMeta}>{runtimeStatus}</Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{runtime?.dataMode ?? "unknown"} mode</Text>
          <Text style={styles.graphMetric}>
            Supabase {runtime?.supabaseConfigured ? "configured" : "not configured"}
          </Text>
          <Text style={styles.graphMetric}>{getValidationLabel()}</Text>
        </View>
      </View>
    );
  };

  const renderLiveSession = (): React.JSX.Element => (
    <View style={styles.statusPanel}>
      <Text style={styles.statusLabel}>Live session</Text>
      <Text style={styles.statusValue}>{signedInUserLabel ?? "No authenticated test user"}</Text>
      <Text style={styles.statusMeta}>{authStatus}</Text>
      <TextInput
        accessibilityLabel="Test user email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setAuthEmail}
        placeholder="Test user email"
        style={styles.singleLineInput}
        value={authEmail}
      />
      <TextInput
        accessibilityLabel="Test user password"
        onChangeText={setAuthPassword}
        placeholder="Test user password"
        secureTextEntry
        style={styles.singleLineInput}
        value={authPassword}
      />
      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSignIn();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSignOut();
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={refreshLiveData}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Refresh API data</Text>
      </Pressable>
    </View>
  );

  const renderTodayHeader = (): React.JSX.Element => (
    <View style={styles.heroPanel}>
      <View style={styles.heroTopRow}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>SBud-d</Text>
          <Text style={styles.heading}>Today, learn with direction.</Text>
          <Text style={styles.body}>{studentContextLabel}</Text>
        </View>
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeLabel}>{runtime?.dataMode ?? "offline"}</Text>
          <Text style={styles.modeBadgeText}>
            {runtime?.supabaseConfigured ? "Live ready" : "Local mode"}
          </Text>
        </View>
      </View>

      <View style={styles.todayFocus}>
        <Text style={styles.sectionKicker}>Focus now</Text>
        <Text style={styles.heroFocusText}>
          {nextPreparation?.topicLabel ??
            priorityRevision?.topicLabel ??
            dashboard.blieRecommendation.title}
        </Text>
        <Text style={styles.heroSupportText}>
          {nextPreparation
            ? `Prepare for ${nextPreparation.subjectName} before the next session.`
            : priorityRevision
              ? priorityRevision.recommendedAction
              : priorityGap
                ? `Strengthen ${priorityGap} to improve your next study session.`
                : dashboard.blieRecommendation.body}
        </Text>
      </View>
      {renderFeedback(apiStatus)}

      <View style={styles.heroActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab("study")}
          style={styles.heroPrimaryAction}
        >
          <Text style={styles.heroPrimaryActionText}>Start study plan</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab("buddy")}
          style={styles.heroSecondaryAction}
        >
          <Text style={styles.heroSecondaryActionText}>Ask BLIE</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderLearningCycle = (): React.JSX.Element => (
    <View style={styles.cycleRail}>
      {[
        {
          label: "Prepare",
          value: studySummary.preparationReadinessLabel,
        },
        {
          label: "Learn",
          value: primarySubject?.currentTopic ?? "Topic pending",
        },
        {
          label: "Revise",
          value: studySummary.revisionProgressLabel,
        },
        {
          label: "Grow",
          value: `${plkgSummary.nodeCount} nodes`,
        },
      ].map((item) => (
        <View key={item.label} style={styles.cycleStep}>
          <Text style={styles.cycleLabel}>{item.label}</Text>
          <Text style={styles.cycleValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const renderDashboard = (): React.JSX.Element => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Learning command centre</Text>
        <Text style={styles.sectionSubtitle}>
          {hasSubjects
            ? "Your next best learning action is ready."
            : "Set up subjects or use fixture mode to preview the full journey."}
        </Text>
      </View>

      <View style={styles.insightGrid}>
        <View style={styles.insightCard}>
          <Text style={styles.panelTitle}>Readiness</Text>
          <Text style={styles.metricText}>{dashboard.learningStatus.readinessLabel}</Text>
          <Text style={styles.mutedText}>{dashboard.learningStatus.knowledgeGrowthLabel}</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.panelTitle}>Knowledge</Text>
          <Text style={styles.metricText}>{plkgSummary.statusLabel}</Text>
          <Text style={styles.mutedText}>{plkgSummary.growthLabel}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.documentHeader}>
          <Text style={styles.panelTitle}>Subjects in motion</Text>
          <Text style={styles.statusPill}>{dashboard.subjects.length} active</Text>
        </View>
        {dashboard.subjects.length === 0
          ? renderActionState({
              actionLabel: "Open Sync setup",
              body: "Subjects are the anchor for documents, BLIE retrieval, study preparation, and PLKG growth.",
              onPress: () => setActiveTab("sync"),
              title: "No subjects loaded yet",
            })
          : dashboard.subjects.map((subject) => (
              <Pressable
                accessibilityRole="button"
                key={subject.id}
                onPress={() => {
                  setSelectedSubjectId(subject.id);
                  setActiveTab("buddy");
                }}
                style={styles.subjectCard}
              >
                <View style={styles.subjectText}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.mutedText}>
                    {subject.code} - {subject.currentTopic ?? "Topic pending"}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${subject.progressPercent}%` }]} />
                  </View>
                </View>
                <View style={styles.subjectScore}>
                  <Text style={styles.progressText}>{subject.progressPercent}%</Text>
                  <Text style={styles.statusPill}>{subject.learningStatus}</Text>
                </View>
              </Pressable>
            ))}
      </View>

      <View style={styles.companionPanel}>
        <Text style={styles.panelTitle}>BLIE guidance</Text>
        <Text style={styles.companionText}>{dashboard.blieRecommendation.title}</Text>
        <Text style={styles.mutedText}>{dashboard.blieRecommendation.body}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab("buddy")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>{dashboard.blieRecommendation.actionLabel}</Text>
        </Pressable>
      </View>
    </>
  );

  const renderPreparationPlan = (plan: StudyPreparationPlan): React.JSX.Element => (
    <View key={plan.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{plan.topicLabel}</Text>
        <Text style={styles.statusPill}>{plan.readinessStatus}</Text>
      </View>
      <Text style={styles.mutedText}>{plan.subjectName}</Text>
      <Text style={styles.mutedText}>Prerequisites: {plan.prerequisiteLabels.join(", ")}</Text>
      {plan.tasks.slice(0, 2).map((task) => (
        <View key={task.id} style={styles.taskBlock}>
          <Text style={styles.responseLabel}>{task.title}</Text>
          <Text style={styles.mutedText}>
            {task.guidance} - {task.estimatedMinutes} min
          </Text>
        </View>
      ))}
      <Text style={styles.statusMeta}>{plan.trace.reason}</Text>
    </View>
  );

  const renderRevisionItem = (item: StudyRevisionItem): React.JSX.Element => (
    <View key={item.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{item.topicLabel}</Text>
        <Text style={styles.statusPill}>{item.priorityLabel}</Text>
      </View>
      <Text style={styles.mutedText}>
        {item.subjectName} - {item.status} - due {item.dueLabel}
      </Text>
      <Text style={styles.mutedText}>{item.recommendedAction}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${item.masteryScore}%` }]} />
      </View>
      {item.flashcards[0] ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>Flashcard</Text>
          <Text style={styles.mutedText}>{item.flashcards[0].front}</Text>
          <Text style={styles.mutedText}>{item.flashcards[0].back}</Text>
        </View>
      ) : null}
      {item.quizQuestions[0] ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>Quiz</Text>
          <Text style={styles.mutedText}>{item.quizQuestions[0].prompt}</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void handleStudyReflection(item);
        }}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Mark reviewed</Text>
      </Pressable>
    </View>
  );

  const renderStudy = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Study coach</Text>
        <Text style={styles.heroFocusText}>{studySummary.recommendedFocusLabel}</Text>
        {renderFeedback(studyStatus)}
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{studySummary.preparationReadinessLabel}</Text>
          <Text style={styles.graphMetric}>{studySummary.revisionProgressLabel}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Before learning</Text>
        {studySummary.preparationPlans.length === 0
          ? renderActionState({
              actionLabel: "Upload material",
              body: "Preparation plans appear after SBud-d has subject context and learning material to reason from.",
              onPress: () => setActiveTab("library"),
              title: "No preparation plan yet",
            })
          : studySummary.preparationPlans.map(renderPreparationPlan)}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>After learning</Text>
        {studySummary.revisionItems.length === 0
          ? renderActionState({
              actionLabel: "Ask BLIE for a quiz",
              body: "Revision cards and reflections become more useful after concepts are extracted into your PLKG.",
              onPress: () => setActiveTab("buddy"),
              title: "No revision queue yet",
            })
          : studySummary.revisionItems.map(renderRevisionItem)}
      </View>
    </>
  );

  const renderLibraryDocument = (document: LearningDocument): React.JSX.Element => (
    <View key={document.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{document.title}</Text>
        <Text style={styles.statusPill}>{document.processing.status}</Text>
      </View>
      <Text style={styles.mutedText}>
        {document.subjectName} - {document.topicLabel ?? "Topic pending"}
      </Text>
      <Text style={styles.mutedText}>{document.processing.label}</Text>
      {document.extractedText ? (
        <Text style={styles.mutedText}>{document.extractedText}</Text>
      ) : null}
      {document.extractedConcepts.length > 0 ? (
        <View style={styles.conceptList}>
          {document.extractedConcepts.map((concept) => (
            <View key={`${document.id}-${concept.label}`} style={styles.conceptItem}>
              <Text style={styles.responseLabel}>{concept.label}</Text>
              <Text style={styles.mutedText}>{concept.description}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${document.processing.progressPercent}%` }]} />
      </View>
      {document.kind === "pdf" && document.processing.status === "processing" ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleExtractDocumentText(document.id);
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Extract text</Text>
        </Pressable>
      ) : null}
      {document.processing.status === "understanding" && document.extractedText ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleMapDocumentConcepts(document.id);
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Map concepts</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const renderLibrary = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Learning material intake</Text>
        <Text style={styles.heroFocusText}>Upload a PDF, prepare it for extraction.</Text>
        {renderFeedback(uploadState)}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleCreateDocument();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Upload sample PDF</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Learning hub</Text>
        {renderFeedback(libraryStatus)}
        {documentLibrary.documents.length === 0
          ? renderActionState({
              actionLabel: "Upload sample PDF",
              body:
                documentLibrary.emptyState.body +
                " The controlled demo starts with one lecture PDF.",
              onPress: () => {
                void handleCreateDocument();
              },
              title: documentLibrary.emptyState.title,
            })
          : documentLibrary.documents.map(renderLibraryDocument)}
      </View>
    </>
  );

  const renderBuddyResponse = (response: BlieChatResponse): React.JSX.Element => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>BLIE Response</Text>
      <Text style={styles.metricText}>{response.response.explanation}</Text>
      <Text style={styles.mutedText}>{response.response.connection}</Text>
      <Text style={styles.responseLabel}>Example</Text>
      <Text style={styles.mutedText}>{response.response.example}</Text>
      <Text style={styles.responseLabel}>Check Understanding</Text>
      <Text style={styles.mutedText}>{response.response.checkUnderstanding}</Text>
      <Text style={styles.responseLabel}>Next Step</Text>
      <Text style={styles.mutedText}>{response.response.nextStep}</Text>
      {response.response.preparationPriorities.length > 0 ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>Before next class</Text>
          {response.response.preparationPriorities.map((priority) => (
            <View key={priority.id} style={styles.conceptItem}>
              <Text style={styles.subjectName}>{priority.title}</Text>
              <Text style={styles.mutedText}>{priority.reason}</Text>
              <Text style={styles.mutedText}>{priority.recommendedAction}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {response.response.quickQuiz.questions.length > 0 ? (
        <View style={styles.taskBlock}>
          <Text style={styles.responseLabel}>{response.response.quickQuiz.title}</Text>
          {response.response.quickQuiz.questions.map((question) => (
            <View key={question.id} style={styles.conceptItem}>
              <Text style={styles.subjectName}>{question.prompt}</Text>
              <Text style={styles.mutedText}>{question.answer}</Text>
              <Text style={styles.statusMeta}>{question.explanation}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={styles.statusMeta}>
        {response.trace.intent} - {response.trace.retrievalStatus} - {response.trace.provider}
      </Text>
    </View>
  );

  const renderBuddy = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>BLIE companion</Text>
        <Text style={styles.heroFocusText}>{blieStatus}</Text>
        {renderFeedback(blieStatus)}
        <Text style={styles.mutedText}>
          Subject context:{" "}
          {dashboard.subjects.find((subject) => subject.id === selectedSubjectId)?.name ??
            "First available subject"}
        </Text>
        <View style={styles.subjectSelector}>
          {dashboard.subjects.length === 0
            ? renderActionState({
                actionLabel: "Check Dashboard",
                body: "BLIE can still answer in fallback mode, but subject context makes the guidance more personal.",
                onPress: () => setActiveTab("dashboard"),
                title: "No subject context selected",
              })
            : dashboard.subjects.map((subject) => {
                const isSelected = subject.id === selectedSubjectId;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={subject.id}
                    onPress={() => setSelectedSubjectId(subject.id)}
                    style={[styles.subjectChip, isSelected && styles.activeSubjectChip]}
                  >
                    <Text
                      style={[styles.subjectChipText, isSelected && styles.activeSubjectChipText]}
                    >
                      {subject.code}
                    </Text>
                  </Pressable>
                );
              })}
        </View>
        <TextInput
          accessibilityLabel="BLIE learning question"
          multiline
          onChangeText={setBlieQuestion}
          placeholder="Ask about a concept, topic, or weak area"
          style={styles.chatInput}
          value={blieQuestion}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSendBlieQuestion();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Send to BLIE</Text>
        </Pressable>
      </View>

      {blieResponse
        ? renderBuddyResponse(blieResponse)
        : renderActionState({
            actionLabel: "Send prepared prompt",
            body: "BLIE will assemble academic profile, subject, document, and PLKG context before generating preparation priorities and a quick quiz.",
            onPress: () => {
              void handleSendBlieQuestion();
            },
            title: "Ready for retrieval-backed guidance",
          })}
    </>
  );

  const renderPlkgNode = (node: PlkgNode): React.JSX.Element => (
    <View key={node.id} style={styles.documentRow}>
      <View style={styles.documentHeader}>
        <Text style={styles.subjectName}>{node.label}</Text>
        <Text style={styles.statusPill}>{node.learningStatus}</Text>
      </View>
      <Text style={styles.mutedText}>
        {node.type} - mastery {node.masteryScore}% - confidence {node.confidenceLevel}%
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${node.masteryScore}%` }]} />
      </View>
    </View>
  );

  const renderPlkg = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Personal knowledge graph</Text>
        <Text style={styles.heroFocusText}>{plkgSummary.statusLabel}</Text>
        {renderFeedback(plkgStatus)}
        <Text style={styles.mutedText}>{plkgSummary.growthLabel}</Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{plkgSummary.nodeCount} nodes</Text>
          <Text style={styles.graphMetric}>{plkgSummary.edgeCount} links</Text>
          <Text style={styles.graphMetric}>{plkgSummary.averageMasteryScore}% mastery</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleAddLearningActivity();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Add learning activity</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Next foundations</Text>
        {plkgSummary.knowledgeGaps.length === 0
          ? renderActionState({
              actionLabel: "Map document concepts",
              body: "Knowledge gaps appear after SBud-d has enough subject, document, and learning activity context.",
              onPress: () => setActiveTab("library"),
              title: "No weak foundations detected yet",
            })
          : plkgSummary.knowledgeGaps.map((gap) => (
              <View key={gap.nodeId} style={styles.documentRow}>
                <Text style={styles.subjectName}>{gap.label}</Text>
                <Text style={styles.mutedText}>{gap.reason}</Text>
                <Text style={styles.mutedText}>{gap.recommendedAction}</Text>
              </View>
            ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Concept memory</Text>
        {plkgSummary.nodes.length === 0
          ? renderActionState({
              actionLabel: "Upload lecture PDF",
              body: "Concept memory grows when uploaded material is extracted and mapped into your PLKG.",
              onPress: () => setActiveTab("library"),
              title: "No concept nodes yet",
            })
          : plkgSummary.nodes.slice(0, 6).map(renderPlkgNode)}
      </View>
    </>
  );

  const renderSync = (): React.JSX.Element => (
    <>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Cloud memory</Text>
        <Text style={styles.metricText}>{syncStatus.connectionStatus}</Text>
        {renderFeedback(syncStatusLabel)}
        {renderFeedback(offlineStorageLabel)}
        <Text style={styles.mutedText}>
          Persistence: {healthStatus.runtime?.persistenceLabel ?? "Runtime pending"}
        </Text>
        <View style={styles.graphMetricRow}>
          <Text style={styles.graphMetric}>{syncStatus.pendingCount} pending</Text>
          <Text style={styles.graphMetric}>{syncStatus.failedCount} failed</Text>
          <Text style={styles.graphMetric}>
            {syncStatus.lastSyncedAt ? "Synced recently" : "No sync yet"}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void handleSyncNow();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sync now</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Live Validation</Text>
        <Text style={styles.metricText}>
          {healthStatus.runtime?.liveValidationStatus === "ready_for_authenticated_validation"
            ? "Ready for local token validation"
            : healthStatus.runtime?.liveValidationStatus === "supabase_configuration_missing"
              ? "Supabase config blocker"
              : "Fixture validation mode"}
        </Text>
        {(
          healthStatus.runtime?.validationNotes ??
          fallbackHealthStatus.runtime?.validationNotes ??
          []
        )
          .slice(0, 3)
          .map((note) => (
            <Text key={note} style={styles.mutedText}>
              {note}
            </Text>
          ))}
      </View>

      {renderRuntimeStatus()}
      {renderLiveSession()}

      <View style={styles.statusPanel}>
        <Text style={styles.statusLabel}>API base URL</Text>
        <Text style={styles.statusValue}>{apiBaseUrl}</Text>
        <Text style={styles.statusMeta}>{apiStatus}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Offline Access</Text>
        {syncStatus.offlineAvailableSections.length === 0
          ? renderActionState({
              body: "Refresh API data once to cache learning sections for offline access.",
              title: "No offline sections cached yet",
            })
          : syncStatus.offlineAvailableSections.map((section) => (
              <View key={section} style={styles.subjectRow}>
                <Text style={styles.subjectName}>{section}</Text>
                <Text style={styles.statusPill}>cached</Text>
              </View>
            ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Pending Queue</Text>
        {syncStatus.queue.length === 0
          ? renderActionState({
              body: "Offline actions from Library, PLKG, and Study will appear here until cloud sync accepts them.",
              title: "Everything is synchronized",
            })
          : syncStatus.queue.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.documentRow}>
                <View style={styles.documentHeader}>
                  <Text style={styles.subjectName}>{item.entityType}</Text>
                  <Text style={styles.statusPill}>{item.status}</Text>
                </View>
                <Text style={styles.mutedText}>
                  {item.operation} - {item.entityId}
                </Text>
                <Text style={styles.statusMeta}>Retries: {item.retryCount}</Text>
              </View>
            ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Conflict Rules</Text>
        {syncStatus.conflictRules.map((rule) => (
          <View key={rule.entityType} style={styles.documentRow}>
            <Text style={styles.subjectName}>{rule.entityType}</Text>
            <Text style={styles.mutedText}>
              {rule.strategy} - {rule.description}
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderTodayHeader()}
        {renderLearningCycle()}
        {renderJourneyProgress()}

        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "study" && renderStudy()}
        {activeTab === "buddy" && renderBuddy()}
        {activeTab === "library" && renderLibrary()}
        {activeTab === "plkg" && renderPlkg()}
        {activeTab === "sync" && renderSync()}

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && styles.activeTab]}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f4",
  },
  container: {
    gap: 16,
    padding: 18,
    paddingBottom: 96,
  },
  eyebrow: {
    color: "#3d6c5f",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  heading: {
    color: "#14231f",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 38,
  },
  body: {
    color: "#42534d",
    fontSize: 17,
    lineHeight: 25,
  },
  heroPanel: {
    backgroundColor: "#fcfbf6",
    borderColor: "#dde4d8",
    borderRadius: 8,
    borderWidth: 1,
    gap: 18,
    padding: 18,
  },
  heroTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  heroCopy: {
    flex: 1,
    gap: 6,
  },
  modeBadge: {
    alignItems: "flex-end",
    backgroundColor: "#e8f0ec",
    borderColor: "#c9d8d0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modeBadgeLabel: {
    color: "#17372e",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modeBadgeText: {
    color: "#456057",
    fontSize: 12,
    fontWeight: "700",
  },
  todayFocus: {
    backgroundColor: "#eef4ee",
    borderRadius: 8,
    gap: 5,
    padding: 14,
  },
  sectionKicker: {
    color: "#587066",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroFocusText: {
    color: "#172923",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 26,
  },
  heroSupportText: {
    color: "#43574f",
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  heroPrimaryAction: {
    alignItems: "center",
    backgroundColor: "#17372e",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 14,
  },
  heroPrimaryActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  heroSecondaryAction: {
    alignItems: "center",
    borderColor: "#17372e",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 14,
  },
  heroSecondaryActionText: {
    color: "#17372e",
    fontSize: 14,
    fontWeight: "900",
  },
  cycleRail: {
    flexDirection: "row",
    gap: 8,
  },
  cycleStep: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4dc",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    minHeight: 78,
    padding: 10,
  },
  cycleLabel: {
    color: "#668075",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  cycleValue: {
    color: "#172923",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  journeyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  journeyStep: {
    backgroundColor: "#f7faf8",
    borderColor: "#dce7df",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexGrow: 1,
    gap: 5,
    minHeight: 74,
    padding: 10,
  },
  doneJourneyStep: {
    backgroundColor: "#e7f3eb",
    borderColor: "#bddcc8",
  },
  journeyLabel: {
    color: "#668075",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  doneJourneyLabel: {
    color: "#1f5e3a",
  },
  journeyValue: {
    color: "#172923",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19,
  },
  doneJourneyValue: {
    color: "#1f5e3a",
  },
  sectionHeader: {
    gap: 4,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#172923",
    fontSize: 21,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: "#61736d",
    fontSize: 14,
  },
  insightGrid: {
    flexDirection: "row",
    gap: 10,
  },
  insightCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4dc",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 128,
    padding: 14,
  },
  statusPanel: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4dc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  statusLabel: {
    color: "#657870",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  statusValue: {
    color: "#172923",
    fontSize: 15,
    fontWeight: "800",
  },
  statusMeta: {
    color: "#60746b",
    fontSize: 13,
    marginTop: 8,
  },
  feedbackStrip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  neutralFeedback: {
    backgroundColor: "#eef2f3",
    borderColor: "#d8e0e1",
  },
  neutralFeedbackText: {
    color: "#405057",
  },
  successFeedback: {
    backgroundColor: "#e7f3eb",
    borderColor: "#c8dfcf",
  },
  successFeedbackText: {
    color: "#1f5e3a",
  },
  warningFeedback: {
    backgroundColor: "#f8f1df",
    borderColor: "#e5d8b9",
  },
  warningFeedbackText: {
    color: "#6a4d16",
  },
  errorFeedback: {
    backgroundColor: "#fae8e5",
    borderColor: "#efc9c3",
  },
  errorFeedbackText: {
    color: "#8a2f22",
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#dce4dc",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  companionPanel: {
    backgroundColor: "#f8f1df",
    borderColor: "#e5d8b9",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  companionText: {
    color: "#2b2518",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26,
  },
  panelTitle: {
    color: "#657870",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  metricText: {
    color: "#172923",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  mutedText: {
    color: "#52655d",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: "#f7faf8",
    borderColor: "#dce7df",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  emptyTitle: {
    color: "#172923",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
  },
  responseLabel: {
    color: "#244b40",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 4,
    textTransform: "uppercase",
  },
  subjectSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectChip: {
    alignItems: "center",
    borderColor: "#cfd9d1",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  activeSubjectChip: {
    backgroundColor: "#17372e",
    borderColor: "#17372e",
  },
  subjectChipText: {
    color: "#304a40",
    fontSize: 13,
    fontWeight: "800",
  },
  activeSubjectChipText: {
    color: "#ffffff",
  },
  chatInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cfd9d1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#172923",
    fontSize: 15,
    lineHeight: 21,
    minHeight: 96,
    padding: 12,
    textAlignVertical: "top",
  },
  singleLineInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cfd9d1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#172923",
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  subjectRow: {
    alignItems: "center",
    borderTopColor: "#edf1f3",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingTop: 12,
  },
  subjectCard: {
    alignItems: "center",
    borderTopColor: "#edf1ed",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingTop: 12,
  },
  subjectText: {
    flex: 1,
    gap: 3,
  },
  subjectScore: {
    alignItems: "flex-end",
    gap: 7,
  },
  subjectName: {
    color: "#172923",
    fontSize: 15,
    fontWeight: "800",
  },
  progressText: {
    color: "#17372e",
    fontSize: 15,
    fontWeight: "800",
  },
  graphMetricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  graphMetric: {
    backgroundColor: "#e8f0ec",
    borderRadius: 8,
    color: "#244b40",
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  documentRow: {
    borderTopColor: "#edf1ed",
    borderTopWidth: 1,
    gap: 7,
    paddingTop: 12,
  },
  documentHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  statusPill: {
    backgroundColor: "#e8f0ec",
    borderRadius: 8,
    color: "#244b40",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  conceptList: {
    gap: 6,
  },
  conceptItem: {
    backgroundColor: "#f4f8f5",
    borderColor: "#d8e3dc",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  progressTrack: {
    backgroundColor: "#e5ece7",
    borderRadius: 8,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#2d7661",
    height: 8,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#17372e",
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    marginTop: 6,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#17372e",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    color: "#17372e",
    fontSize: 13,
    fontWeight: "800",
  },
  taskBlock: {
    gap: 4,
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tab: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cfd9d1",
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: "30%",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  activeTab: {
    backgroundColor: "#17372e",
    borderColor: "#17372e",
  },
  tabText: {
    color: "#304a40",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
  },
  activeTabText: {
    color: "#ffffff",
  },
});
