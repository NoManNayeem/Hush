import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Disclaimer
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground/90">
            <p className="mb-6">
              <strong>Important:</strong> All content on Hush is entirely fictional and created for entertainment purposes only.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              Fictional Content
            </h2>
            <p className="mb-4">
              Every story, theory, mystery, and piece of content published on Hush is a work of fiction. 
              These are creative explorations of imagination, not factual accounts or real events.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              No Real People or Events
            </h2>
            <p className="mb-4">
              Any resemblance to real persons, living or dead, or actual events is purely coincidental. 
              All characters, names, places, and incidents are products of the authors' imaginations.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              Entertainment Only
            </h2>
            <p className="mb-4">
              Hush is designed as a platform for creative storytelling and imaginative exploration. 
              It is not intended to spread misinformation, conspiracy theories, or false information about real events.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              User Responsibility
            </h2>
            <p className="mb-4">
              By using this platform, you acknowledge that you understand all content is fictional. 
              You agree not to use any information from Hush as factual or to make decisions based on fictional content.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              Content Moderation
            </h2>
            <p className="mb-4">
              While we encourage creative freedom, all content must be clearly marked as fictional. 
              Content that attempts to present fiction as fact will be removed.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              Age Appropriateness
            </h2>
            <p className="mb-4">
              Some content may contain themes of horror, mystery, or suspense. 
              Users should be aware that content may not be suitable for all audiences.
            </p>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
              Platform Purpose
            </h2>
            <p className="mb-4">
              Hush exists to celebrate the art of storytelling, the power of imagination, 
              and the joy of creative exploration. We believe in the value of fiction as a form of entertainment and artistic expression.
            </p>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> October 2025
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                If you have any questions about this disclaimer, please contact us through our 
                <a href="/developer" className="text-primary hover:underline"> developer page</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
