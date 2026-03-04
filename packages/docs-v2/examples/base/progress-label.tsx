import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/examples/base/ui/progress"

function ProgressWithLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
