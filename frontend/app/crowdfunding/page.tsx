"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, Lock, Share2, TrendingUp, Users } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import { Progress } from "@/components/ui/progress"

export default function CrowdfundingPage() {
  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container px-4 md:px-6 content-overlay">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Research <span className="gradient-text">Crowdfunding</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Get funding directly from supporters who believe in your research and contribute to scientific progress.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" style={{ backgroundColor: "hsl(var(--orange))" }}>
                Start Fundraising
              </Button>
              <Button size="lg" variant="outline">
                Browse Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Our platform connects researchers with supporters through a transparent and secure crowdfunding process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="relative">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <CardHeader>
                <CardTitle>Create Project</CardTitle>
                <CardDescription>
                  Submit your research proposal with clear milestones and funding requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Define research objectives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Set funding milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Specify data sharing terms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <CardHeader>
                <CardTitle>Receive Funding</CardTitle>
                <CardDescription>Supporters purchase NFT access rights to back your research</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Transparent funding process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Smart contract-based milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Automatic fund distribution</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <CardHeader>
                <CardTitle>Share Benefits</CardTitle>
                <CardDescription>Both researchers and supporters benefit from the research success</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Revenue sharing from citations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Access to research data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <span>Long-term collaboration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Financial Policy Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">DeSciData Financial Policy</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Our transparent financial policies ensure fair distribution of funds and sustainable growth.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Funding Guarantees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-background/50">
                  <h3 className="font-medium mb-2">Full Refund Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    All funds are returned to backers if a campaign fails to meet its minimum threshold within the deadline. Our smart contract ensures automatic refunds without any manual intervention.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background/50">
                  <h3 className="font-medium mb-2">Platform Fee Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    A 5% platform fee is deducted only from successfully funded projects, applied post-raise. For example, from a $100k raised campaign, $5k goes to platform maintenance, and $95k is allocated to research.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                  </svg>
                  Capital Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-background/50">
                  <h3 className="font-medium mb-2">Low-Risk Investment</h3>
                  <p className="text-sm text-muted-foreground">
                    Idle funds are pooled into SEC-compliant treasury bonds, generating a 2-4% annual yield. This ensures capital preservation while generating additional returns for all stakeholders.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background/50">
                  <h3 className="font-medium mb-2">Quarterly Profit Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Yields are distributed quarterly with a transparent formula: 70% to researchers, 20% to sponsors, and 10% to platform reserves. All transactions are recorded on-chain for full financial transparency.
                  </p>
                  <div className="mt-3">
                    <Progress value={70} className="h-2 mb-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>70% Researchers</span>
                      <span>20% Sponsors</span>
                      <span>10% Platform</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Our innovative features ensure transparent, secure, and mutually beneficial research funding.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>NFT Access Rights</CardTitle>
                <CardDescription>
                  Supporters receive NFTs granting them exclusive access to experimental data and future benefits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Transferable</Badge>
                    <span>Trade or transfer access rights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Verifiable</Badge>
                    <span>Blockchain-backed ownership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Flexible</Badge>
                    <span>Customizable access periods</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Milestone-Based Funding</CardTitle>
                <CardDescription>
                  Funds are released according to predefined research milestones, ensuring accountability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Smart Contract</Badge>
                    <span>Automated fund release</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Transparent</Badge>
                    <span>Clear milestone tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Secure</Badge>
                    <span>Protected fund management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Share2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Revenue Sharing</CardTitle>
                <CardDescription>
                  Supporters earn returns when research data is cited or reused in future projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Automatic</Badge>
                    <span>Smart distribution system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Fair</Badge>
                    <span>Proportional to contribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Ongoing</Badge>
                    <span>Long-term benefits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              See how researchers and supporters are benefiting from our platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {successStories.map((story, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{story.category}</Badge>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      Funded Successfully
                    </Badge>
                  </div>
                  <CardTitle>{story.title}</CardTitle>
                  <CardDescription>{story.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Funding Goal</span>
                      <span className="font-medium">${story.fundingGoal.toLocaleString()} $EDU</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{story.supporters} Supporters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{story.citations} Citations</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key Achievements:</div>
                    <ul className="space-y-1 text-sm">
                      {story.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View More Success Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 sm:p-12">
              <div className="grid gap-4 md:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
                  <p className="text-primary-foreground/90 mb-4">
                    Join our platform to fund your research or support groundbreaking scientific projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="lg" variant="secondary">
                      Start a Project
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Research visualization"
                      className="w-full rounded-lg opacity-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

const successStories = [
  {
    category: "Quantum Computing",
    title: "Quantum Algorithm for Drug Discovery",
    description: "Developed novel quantum algorithms that accelerated drug candidate screening by 10x.",
    fundingGoal: 50000,
    supporters: 128,
    citations: 45,
    achievements: [
      "Published in Nature Quantum",
      "10x faster molecular simulations",
      "2 patent applications filed",
      "Ongoing pharma industry partnerships",
    ],
  },
  {
    category: "Climate Science",
    title: "Marine Ecosystem Impact Study",
    description: "Comprehensive study of climate change effects on coral reef biodiversity.",
    fundingGoal: 35000,
    supporters: 89,
    citations: 32,
    achievements: [
      "Published in Science",
      "New species discovered",
      "Conservation policy impact",
      "International collaboration network",
    ],
  },
]

