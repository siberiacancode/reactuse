import { Label } from "@/examples/radix/ui/label"
import { Switch } from "@/examples/radix/ui/switch"

function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
