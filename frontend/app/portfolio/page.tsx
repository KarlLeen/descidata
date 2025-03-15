"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Clock, Lock, RefreshCw, Wallet } from "lucide-react"
import { UploadDataModal } from "@/components/upload-data-modal"
import type { MyProject, Investment } from "@/types/portfolio"
import { useWallet } from "@/hooks/useWallet"
import { useProjects } from "@/contexts/project-context"
import { useInvestments } from "@/contexts/investment-context"
import { Loading } from "@/components/ui/loading"

export default function PortfolioPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<MyProject | null>(null)
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('')
  const [isInitializing, setIsInitializing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected, connectWallet } = useWallet()
  const { projects } = useProjects()
  const { investments } = useInvestments()
  
  // Set loading state to false once data is loaded
  useEffect(() => {
    // Short timeout to ensure UI renders smoothly
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [projects, investments])
  
  // Initialize sample data based on the 3-phase, 20-week project structure
  const { addProject, updateProject } = useProjects()
  const { addInvestment } = useInvestments()
  
  const initializePortfolioData = async () => {
    setIsInitializing(true)
    try {
      // Create sample projects based on the 3-phase, 20-week project structure
      const sampleProjects: Omit<MyProject, "id">[] = [
        // Phase 1 project - Funding stage
        {
          title: "Blockchain-based Research Data Sharing Platform",
          description: "A decentralized platform for scientific data sharing with blockchain-based verification",
          fundingGoal: 100000,
          fundingRaised: 65000,
          status: "funding" as const,
          createdAt: "2025-03-01",
          nextMilestone: {
            id: "ms-1-1",
            title: "MS 1.1: User System & Authentication",
            deadline: "2025-04-30",
            fundingLocked: 20000,
            phase: 1
          },
          progress: 0,
          dataUploads: [],
          milestones: [
            {
              id: "ms-1-1",
              title: "MS 1.1: User System & Authentication",
              deadline: "2025-04-30",
              fundingLocked: 20000,
              progress: 0,
              phase: 1,
              kpis: [
                { name: "Wallet Integration", target: 3, current: 0 },
                { name: "Auth Success Rate", target: 95, current: 0, unit: "%" }
              ]
            },
            {
              id: "ms-1-2",
              title: "MS 1.2: Data Management",
              deadline: "2025-06-15",
              fundingLocked: 25000,
              progress: 0,
              phase: 1,
              kpis: [
                { name: "Upload Success Rate", target: 99, current: 0, unit: "%" },
                { name: "Metadata Fields", target: 10, current: 0 }
              ]
            },
            {
              id: "ms-1-3",
              title: "MS 1.3: Smart Contracts",
              deadline: "2025-07-30",
              fundingLocked: 20000,
              progress: 0,
              phase: 1,
              kpis: [
                { name: "Test Coverage", target: 90, current: 0, unit: "%" },
                { name: "Gas Optimization", target: 30, current: 0, unit: "%" }
              ]
            }
          ]
        },
        
        // Phase 2 project - In progress
        {
          title: "Decentralized Scientific Data Validation System",
          description: "A system for validating scientific data through peer review and blockchain verification",
          fundingGoal: 150000,
          fundingRaised: 150000,
          status: "in_progress" as const,
          createdAt: "2025-01-15",
          nextMilestone: {
            id: "ms-2-1",
            title: "MS 2.1: NFT Features",
            deadline: "2025-05-15",
            fundingLocked: 30000,
            phase: 2
          },
          progress: 45,
          dataUploads: [
            {
              id: "upload-1",
              date: "2025-02-20",
              title: "User Authentication System Test Data",
              status: "completed",
              size: "1.2 GB",
              format: "JSON/CSV"
            },
            {
              id: "upload-2",
              date: "2025-03-01",
              title: "Data Management Module Architecture Documentation",
              status: "completed",
              size: "15 MB",
              format: "PDF/Diagrams"
            }
          ],
          milestones: [
            {
              id: "ms-1-1",
              title: "MS 1.1: User System & Authentication",
              deadline: "2025-02-28",
              fundingLocked: 0,
              progress: 100,
              phase: 1,
              completedAt: "2025-02-25",
              kpis: [
                { name: "Wallet Integration", target: 3, current: 3 },
                { name: "Auth Success Rate", target: 95, current: 97, unit: "%" }
              ]
            },
            {
              id: "ms-1-2",
              title: "MS 1.2: Data Management",
              deadline: "2025-03-30",
              fundingLocked: 0,
              progress: 100,
              phase: 1,
              completedAt: "2025-03-25",
              kpis: [
                { name: "Upload Success Rate", target: 99, current: 99.5, unit: "%" },
                { name: "Metadata Fields", target: 10, current: 12 }
              ]
            },
            {
              id: "ms-1-3",
              title: "MS 1.3: Smart Contracts",
              deadline: "2025-04-15",
              fundingLocked: 0,
              progress: 100,
              phase: 1,
              completedAt: "2025-04-10",
              kpis: [
                { name: "Test Coverage", target: 90, current: 92, unit: "%" },
                { name: "Gas Optimization", target: 30, current: 35, unit: "%" }
              ]
            },
            {
              id: "ms-2-1",
              title: "MS 2.1: NFT Features",
              deadline: "2025-05-15",
              fundingLocked: 30000,
              progress: 65,
              phase: 2,
              kpis: [
                { name: "Minting Success Rate", target: 100, current: 85, unit: "%" },
                { name: "Pricing Models", target: 3, current: 2 }
              ]
            },
            {
              id: "ms-2-2",
              title: "MS 2.2: Citation System",
              deadline: "2025-06-30",
              fundingLocked: 25000,
              progress: 30,
              phase: 2,
              kpis: [
                { name: "Tracking Accuracy", target: 100, current: 70, unit: "%" },
                { name: "Verification Time", target: 1, current: 2.5, unit: "s" }
              ]
            },
            {
              id: "ms-2-3",
              title: "MS 2.3: UI/UX Improvements",
              deadline: "2025-07-31",
              fundingLocked: 25000,
              progress: 15,
              phase: 2,
              kpis: [
                { name: "Load Time", target: 2, current: 3.5, unit: "s" },
                { name: "UX Score", target: 90, current: 75 }
              ]
            }
          ]
        },
        
        // Phase 3 project - Completed
        {
          title: "Research Data Citation Tracking System",
          description: "A system for tracking citations and usage of research data across publications",
          fundingGoal: 80000,
          fundingRaised: 80000,
          status: "completed" as const,
          createdAt: "2024-10-01",
          completedAt: "2025-02-28",
          nextMilestone: {
            id: "ms-3-3",
            title: "MS 3.3: API & Integration",
            deadline: "2025-02-15",
            fundingLocked: 0,
            phase: 3
          },
          progress: 100,
          dataUploads: [
            {
              id: "upload-3",
              date: "2024-12-15",
              title: "Citation Tracking Algorithm Source Code",
              status: "completed",
              size: "45 MB",
              format: "GitHub Repository"
            },
            {
              id: "upload-4",
              date: "2025-01-10",
              title: "System Performance Test Report",
              status: "completed",
              size: "8 MB",
              format: "PDF/Excel"
            },
            {
              id: "upload-5",
              date: "2025-01-25",
              title: "User Feedback and Improvement Suggestions",
              status: "completed",
              size: "3 MB",
              format: "PDF/JSON"
            },
            {
              id: "upload-6",
              date: "2025-02-20",
              title: "Final Documentation and API Reference",
              status: "completed",
              size: "22 MB",
              format: "PDF/Markdown"
            }
          ],
          milestones: [
            {
              id: "ms-3-1",
              title: "MS 3.1: Crowdfunding Module",
              deadline: "2024-12-15",
              fundingLocked: 0,
              progress: 100,
              phase: 3,
              completedAt: "2024-12-10",
              kpis: [
                { name: "Funding Success Rate", target: 95, current: 98, unit: "%" },
                { name: "Evaluation Score", target: 90, current: 92 }
              ]
            },
            {
              id: "ms-3-2",
              title: "MS 3.2: Data Validation System",
              deadline: "2025-01-30",
              fundingLocked: 0,
              progress: 100,
              phase: 3,
              completedAt: "2025-01-25",
              kpis: [
                { name: "Validation Accuracy", target: 95, current: 97, unit: "%" },
                { name: "Peer Review Completion", target: 90, current: 95, unit: "%" }
              ]
            },
            {
              id: "ms-3-3",
              title: "MS 3.3: API & Integration",
              deadline: "2025-02-15",
              fundingLocked: 0,
              progress: 100,
              phase: 3,
              completedAt: "2025-02-10",
              kpis: [
                { name: "API Response Time", target: 100, current: 85, unit: "ms" },
                { name: "SDK Success Rate", target: 95, current: 98, unit: "%" }
              ]
            }
          ]
        }
      ];

      // Investment data for different phases aligned with the milestone tracking functionality
      const sampleInvestments: Omit<Investment, "id">[] = [
        // Early investment - Phase 1 project
        {
          projectId: "external-project-1",
          title: "Infrastructure & Core Features Development",
          investmentAmount: 10000,
          investmentDate: "2025-02-15",
          accessUntil: "2026-03-15",
          citations: 5,
          earnings: 200,
          updates: [
            {
              id: "update-1",
              date: "2025-03-01",
              title: "User System & Auth - KPIs: 3 wallets, 95% auth success",
              details: "Successfully integrated MetaMask, WalletConnect, and Coinbase Wallet"
            },
            {
              id: "update-2",
              date: "2025-03-10",
              title: "Data Management - KPIs: 99% upload success, 10 metadata fields",
              details: "Implemented IPFS storage with redundancy and metadata validation"
            }
          ],
          rights: [
            "Access to all research data",
            "Usage rights for derivative research",
            "Revenue share from citations",
            "Access to future updates"
          ]
        },
        
        // Mid-stage investment - Phase 2 project
        {
          projectId: "external-project-2",
          title: "Feature Extension Phase",
          investmentAmount: 15000,
          investmentDate: "2025-01-20",
          accessUntil: "2025-09-30",
          citations: 18,
          earnings: 650,
          updates: [
            {
              id: "update-3",
              date: "2025-02-15",
              title: "NFT Features - KPIs: 100% minting success, 3 pricing models",
              details: "Implemented ERC-721 and ERC-1155 standards with dynamic pricing"
            },
            {
              id: "update-4",
              date: "2025-03-05",
              title: "Citation System - KPIs: 100% tracking accuracy, 1s verification",
              details: "Developed DOI integration and blockchain-based verification"
            }
          ],
          rights: [
            "Access to all research data",
            "Usage rights for derivative research",
            "Revenue share from citations",
            "Access to future updates",
            "Participation in research direction decisions"
          ]
        },
        
        // Late-stage investment - Phase 3 project
        {
          projectId: "external-project-3",
          title: "Ecosystem & Scalability",
          investmentAmount: 20000,
          investmentDate: "2024-12-10",
          accessUntil: "2025-12-31",
          citations: 32,
          earnings: 1200,
          updates: [
            {
              id: "update-5",
              date: "2025-01-20",
              title: "Crowdfunding - KPIs: 95% funding success, 90 evaluation score",
              details: "Launched multi-tier funding model with milestone-based releases"
            },
            {
              id: "update-6",
              date: "2025-02-28",
              title: "Data Validation - KPIs: 95% accuracy, 90% peer review completion",
              details: "Implemented decentralized peer review system with reputation scoring"
            },
            {
              id: "update-7",
              date: "2025-03-10",
              title: "API & Integration - KPIs: 100ms response time, 95% SDK success",
              details: "Released public API with comprehensive documentation and SDKs"
            }
          ],
          rights: [
            "Access to all research data",
            "Usage rights for derivative research",
            "Revenue share from citations",
            "Access to future updates",
            "Participation in research direction decisions",
            "Technical patent sharing"
          ]
        }
      ];

      // Clear existing data
      localStorage.removeItem('projects');
      localStorage.removeItem('investments');
      
      // Add projects and investments using the context methods
      const projectPromises = sampleProjects.map(project => addProject(project));
      const investmentPromises = sampleInvestments.map(investment => addInvestment(investment));
      
      // Wait for all operations to complete
      await Promise.all([...projectPromises, ...investmentPromises]);
      
      alert(`Successfully initialized portfolio data!\n- Added ${sampleProjects.length} projects in different phases\n- Added ${sampleInvestments.length} investments in different phases`);
      setIsInitializing(false);
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Error initializing data:\n' + (error instanceof Error ? error.message : String(error)));
      setIsInitializing(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to view your portfolio, including your projects and investments.
          </p>
          <Button onClick={connectWallet} size="lg">
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        </div>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <Loading text="Loading portfolio data..." size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <Button variant="outline" onClick={initializePortfolioData} disabled={isInitializing}>
          {isInitializing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Initialize Sample Data
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="my-projects">
        <TabsList className="mb-4">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="my-investments">My Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first research project to begin tracking progress and receiving funding.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button style={{ backgroundColor: "hsl(var(--orange))" }} onClick={() => (window.location.href = "/")}>
                  Start a Project
                </Button>
                <p className="text-sm text-muted-foreground">or</p>
                <Button variant="outline" onClick={initializePortfolioData} disabled={isInitializing}>
                  Initialize Sample Projects
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpload={(project) => {
                    setSelectedProject(project)
                    setIsUploadModalOpen(true)
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-investments">
          {investments.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Investments Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start investing in research projects to gain access rights and potential returns.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  style={{ backgroundColor: "hsl(var(--orange))" }}
                  onClick={() => (window.location.href = "/experiments")}
                >
                  Browse Experiments
                </Button>
                <p className="text-sm text-muted-foreground">or</p>
                <Button variant="outline" onClick={initializePortfolioData} disabled={isInitializing}>
                  Initialize Sample Investments
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {investments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedProject && (
        <UploadDataModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          project={selectedProject}
          milestoneId={selectedMilestoneId || '1'}
          onUploadSuccess={(milestoneId, uploadData) => {
            // 更新项目数据，添加新的数据上传记录
            const updatedProject = {...selectedProject}
            updatedProject.dataUploads = [
              ...(updatedProject.dataUploads || []),
              {
                date: new Date().toISOString().split('T')[0],
                title: uploadData.title,
                status: 'completed'
              }
            ]
            // 这里可以调用updateProject方法更新项目数据
            console.log('数据上传成功:', milestoneId, uploadData)
          }}
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onUpload }: { project: MyProject; onUpload: (project: MyProject) => void }) {
  const percentFunded = Math.round((project.fundingRaised / project.fundingGoal) * 100)

  // Determine the current phase based on project status and progress
  const getProjectPhase = () => {
    if (project.status === "funding") return "Phase 1: Infrastructure & Core Features"
    if (project.status === "in_progress" && project.progress < 50) return "Phase 2: Feature Extension"
    if (project.status === "in_progress" && project.progress >= 50) return "Phase 2-3: Transition"
    return "Phase 3: Ecosystem & Scalability"
  }

  // Get estimated completion date based on milestone deadline
  const getEstimatedCompletion = () => {
    if (project.status === "completed") return "Completed"
    
    const deadline = new Date(project.nextMilestone.deadline)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
    return deadline.toLocaleDateString('en-US', options)
  }

  // Calculate KPI completion percentage
  const getKpiCompletion = () => {
    if (project.status === "funding") return 0
    if (project.status === "completed") return 100
    
    // For in-progress projects, use a formula based on progress and uploads
    const baseProgress = project.progress
    const uploadBonus = Math.min(project.dataUploads?.length * 5 || 0, 15) // Max 15% bonus from uploads
    return Math.min(baseProgress + uploadBonus, 95) // Cap at 95% unless completed
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 px-6 py-2 text-xs font-medium">
        {getProjectPhase()}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-2">{project.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {project.status === "funding" ? (
                <Badge variant="secondary">Funding</Badge>
              ) : project.status === "in_progress" ? (
                <Badge variant="default">In Progress</Badge>
              ) : (
                <Badge variant="success">Completed</Badge>
              )}
              <span className="text-muted-foreground">Est. completion: {getEstimatedCompletion()}</span>
            </CardDescription>
          </div>
          {(project.status === "in_progress" || project.status === "completed") && (
            <Button variant="outline" size="sm" onClick={() => onUpload(project)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.status === "funding" ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span>{percentFunded}%</span>
            </div>
            <Progress value={percentFunded} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${project.fundingRaised.toLocaleString()} raised</span>
              <span>${project.fundingGoal.toLocaleString()} goal</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Project Details</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 3-phase, 20-week research project</li>
                <li>• Quantifiable KPIs for each milestone</li>
                <li>• Milestone-based funding release</li>
                <li>• Data ownership and citation tracking</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span>Project Progress</span>
                  <div className="text-xs text-muted-foreground">KPI Completion: {getKpiCompletion()}%</div>
                </div>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Current Milestone</h4>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>{project.nextMilestone.title}</span>
                  <Badge variant="outline">
                    <Lock className="h-3 w-3 mr-1" />
                    {project.nextMilestone.fundingLocked} $EDU
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Due {project.nextMilestone.deadline}
                </div>
                <div className="mt-2 text-xs border-t border-border pt-2">
                  <div className="font-medium mb-1">Key Performance Indicators:</div>
                  {project.nextMilestone.title.includes("User System") && (
                    <div>• 3 wallets, 95% auth success</div>
                  )}
                  {project.nextMilestone.title.includes("Data Management") && (
                    <div>• 99% upload success, 10 metadata fields</div>
                  )}
                  {project.nextMilestone.title.includes("Smart Contracts") && (
                    <div>• 90% test coverage, 30% gas optimization</div>
                  )}
                  {project.nextMilestone.title.includes("NFT") && (
                    <div>• 100% minting success, 3 pricing models</div>
                  )}
                  {project.nextMilestone.title.includes("Citation") && (
                    <div>• 100% tracking accuracy, 1s verification</div>
                  )}
                  {project.nextMilestone.title.includes("UI/UX") && (
                    <div>• 2s load time, 90+ UX score</div>
                  )}
                  {project.nextMilestone.title.includes("Crowdfunding") && (
                    <div>• 95% funding success, 90 evaluation score</div>
                  )}
                  {project.nextMilestone.title.includes("Data Validation") && (
                    <div>• 95% accuracy, 90% peer review completion</div>
                  )}
                  {project.nextMilestone.title.includes("API") && (
                    <div>• 100ms response time, 95% SDK success</div>
                  )}
                </div>
              </div>
            </div>

            {project.dataUploads && project.dataUploads.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recent Data Uploads</h4>
                <div className="space-y-2">
                  {project.dataUploads.map((upload, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{upload.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{upload.date}</span>
                        <Badge variant={upload.status === "completed" ? "success" : "secondary"}>
                          {upload.status === "completed" ? "Uploaded" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function InvestmentCard({ investment }: { investment: Investment }) {
  // Calculate ROI (Return on Investment)
  const calculateROI = () => {
    const roi = (investment.earnings / investment.investmentAmount) * 100
    return roi.toFixed(1)
  }

  // Calculate citation impact
  const getCitationImpact = () => {
    if (investment.citations < 10) return "Low"
    if (investment.citations < 25) return "Medium"
    return "High"
  }

  // Get investment phase
  const getInvestmentPhase = () => {
    if (investment.investmentAmount < 12000) return "Phase 1: Infrastructure & Core Features"
    if (investment.investmentAmount < 18000) return "Phase 2: Feature Extension"
    return "Phase 3: Ecosystem & Scalability"
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 px-6 py-2 text-xs font-medium">
        {getInvestmentPhase()}
      </div>
      <CardHeader>
        <CardTitle className="mb-2">{investment.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Access until {investment.accessUntil}
            </Badge>
            <Badge variant="secondary">
              ROI: {calculateROI()}%
            </Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Investment</div>
            <div className="font-medium">{investment.investmentAmount} $EDU</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Citations</div>
            <div className="font-medium flex items-center gap-1">
              {investment.citations}
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted">{getCitationImpact()} Impact</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Earnings</div>
            <div className="font-medium text-green-600">{investment.earnings} $EDU</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Updates</div>
            <div className="font-medium">{investment.updates.length}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Updates</h4>
          <div className="space-y-2">
            {investment.updates.slice(0, 2).map((update, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{update.title}</span>
                <span className="text-muted-foreground">{update.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Your Rights</h4>
          <div className="space-y-1">
            {investment.rights.map((right, index) => (
              <div key={index} className="text-sm flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {right}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = `/dashboard/projects/${investment.id}`}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}



