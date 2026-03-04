import { Tabs, TabsList, TabsTrigger } from "@/examples/radix/ui/tabs"

function TabsVertical() {
  return (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
