import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, ExternalLink } from "lucide-react";

export default function SetupAssistant() {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Assistant Setup Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              The AI assistant needs an OpenAI API key to function. This key should be stored securely in Supabase secrets.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Setup Steps:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Get your OpenAI API key from the OpenAI Platform</li>
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Settings → Edge Functions</li>
                <li>Add a new secret named: <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code></li>
                <li>Paste your OpenAI API key as the value</li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-2">
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Get OpenAI API Key
              </a>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Supabase Dashboard
              </a>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Once the secret is configured, refresh this page to use the assistant.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}