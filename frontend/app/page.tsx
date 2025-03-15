"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, FlaskRoundIcon as Flask, Users } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "@/components/animated-background"
import LabEquipment from "@/components/lab-equipment"
import { useState } from "react"
import { CreateExperimentModal } from "@/components/create-experiment-modal"

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="container px-4 md:px-6 content-overlay">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#0000FF]" />
                <span className="text-sm font-medium">Powered by EDU Chain</span>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="gradient-text">Decentralized Data</span> for a Better Future
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                DeSciData connects researchers, data, and funding through blockchain technology to accelerate scientific
                discovery.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                style={{ backgroundColor: "hsl(var(--orange))" }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Start a Project
              </Button>
              <Button size="lg" variant="outline">
                Explore Research
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container px-4 md:px-6 content-overlay">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur glow-effect">
              <CardHeader>
                <Flask className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Experiment Plans</CardTitle>
                <CardDescription>Create and share your research plans with the scientific community.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Publish detailed experiment plans, methodologies, and expected outcomes to attract collaborators and
                  funding.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/experiments" className="text-primary text-sm flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
            <Card className="bg-card/60 backdrop-blur glow-effect">
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle>DeSciData NFT</CardTitle>
                <CardDescription>Store and share research data securely with blockchain-backed NFTs.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NFTs ensure data integrity, provenance, and access control, allowing researchers to track ownership,
                  manage permissions, and share data transparently.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/data" className="text-primary text-sm flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
            <Card className="bg-card/60 backdrop-blur glow-effect">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Research Crowdfunding</CardTitle>
                <CardDescription>Get funding directly from supporters who believe in your research.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with backers who share your vision and want to support scientific advancement.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/crowdfunding" className="text-primary text-sm flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Founders */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Meet Our Founders</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Passionate about decentralizing science and empowering researchers worldwide
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="bg-card/80 backdrop-blur overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20at%2000.43.19-3epEpdGczGSZRylzDceqd3YDB72P5h.png"
                  alt="Karl at EDU Chain Hackerhouse"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>Karl</CardTitle>
                <CardDescription>Co-Founder & Technical Lead</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blockchain enthusiast and technical innovator, leading the development of DeSciData's decentralized
                  infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-26%20at%2000.43.28-fSUBHMIkRizuPxeAMsuRuwH2vjpFeg.png"
                  alt="Summer at EDU Chain Hackerhouse"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>Summer</CardTitle>
                <CardDescription>Co-Founder & Product Lead</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Driving the vision of open science forward, connecting researchers and resources to accelerate
                  scientific discovery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Research Projects</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Discover groundbreaking research projects seeking support and collaboration.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline">View All Projects</Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container px-4 md:px-6 content-overlay">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How DeSciData Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Our platform connects researchers, data, and funding through a transparent blockchain-based ecosystem.
              </p>
            </div>
          </div>

          <LabEquipment />

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">1</div>
              <h3 className="text-xl font-bold">Create Research Plan</h3>
              <p className="text-muted-foreground">
                Researchers publish their experiment plans, methodologies, and expected outcomes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">2</div>
              <h3 className="text-xl font-bold">Secure Funding</h3>
              <p className="text-muted-foreground">
                Projects receive funding through crowdfunding, grants, or investment from supporters.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">3</div>
              <h3 className="text-xl font-bold">Share Data & Results</h3>
              <p className="text-muted-foreground">
                Research data is stored on decentralized networks with transparent access controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6 content-overlay">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Join the Scientific Revolution?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Start your research journey with DeSciData today and be part of the decentralized science movement.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" style={{ backgroundColor: "hsl(var(--orange))" }}>
                Start a Project
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CreateExperimentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}

interface Project {
  title: string
  description: string
  category: string
  fundingGoal: number
  fundingRaised: number
  daysLeft: number
  author: {
    name: string
    institution: string
  }
}

const featuredProjects: Project[] = [
  {
    title: "Quantum Computing for Drug Discovery",
    description: "Using quantum algorithms to accelerate the discovery of novel pharmaceutical compounds.",
    category: "Quantum Computing",
    fundingGoal: 50000,
    fundingRaised: 32500,
    daysLeft: 15,
    author: {
      name: "Dr. Sarah Chen",
      institution: "Quantum Research Institute",
    },
  },
  {
    title: "Climate Change Impact on Marine Ecosystems",
    description: "Studying the effects of rising ocean temperatures on coral reef biodiversity.",
    category: "Environmental Science",
    fundingGoal: 35000,
    fundingRaised: 28000,
    daysLeft: 21,
    author: {
      name: "Prof. Michael Torres",
      institution: "Ocean Sciences Laboratory",
    },
  },
  {
    title: "Neural Networks for Early Disease Detection",
    description: "Developing AI models to identify early markers of neurodegenerative diseases.",
    category: "AI & Medicine",
    fundingGoal: 75000,
    fundingRaised: 45000,
    daysLeft: 30,
    author: {
      name: "Dr. Emily Johnson",
      institution: "Neural Health Research Center",
    },
  },
]

function ProjectCard({ project }: { project: Project }) {
  const percentFunded = Math.round((project.fundingRaised / project.fundingGoal) * 100)

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader>
        <div className="text-sm font-medium text-primary">{project.category}</div>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Funding Progress</span>
              <span className="font-medium">{percentFunded}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percentFunded}%`,
                  backgroundColor: percentFunded >= 100 ? "hsl(var(--success))" : "hsl(var(--primary))",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>${project.fundingRaised.toLocaleString()} raised</span>
              <span>${project.fundingGoal.toLocaleString()} goal</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{project.daysLeft}</span> days left
            </div>
            <div className="text-sm text-muted-foreground">By {project.author?.name || '未知'}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Support Project</Button>
      </CardFooter>
    </Card>
  )
}

