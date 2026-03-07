import { Label } from "@/examples/base/ui/label"
import { Switch } from "@/examples/base/ui/switch"

function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
