import { ProtectedCheckpoint } from "@/components/ProtectedCheckpoint";
import { stage02Checkpoint } from "@/content/spanish-foundations/stages-02-04";

export default function StageTwoCheckpointPage() {
  return <ProtectedCheckpoint lesson={stage02Checkpoint} stage={2} />;
}
