


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Configure your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Email Notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">Receive updates about your certificates and account</p>
            <Button variant="outline">Configure Notifications</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  )
}
