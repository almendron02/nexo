import { ProtectedCheckpoint } from "@/components/ProtectedCheckpoint";
import { stage01Checkpoint } from "@/content/spanish-foundations/module-04";

export default function StageOneCheckpointPage() {
  return <ProtectedCheckpoint lesson={stage01Checkpoint} stage={1} />;
}
