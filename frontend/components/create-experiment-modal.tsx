"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { useWallet } from "@/hooks/useWallet"
import { Loader2, Wallet, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProjects } from "@/contexts/project-context"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface KPI {
  metric: string
  target: string
  current?: string
}

interface Milestone {
  id: string
  name: string
  targetProgress: string
  kpis: KPI[]
  phaseId: string
}

interface CreateExperimentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateExperimentModal({ isOpen, onClose }: CreateExperimentModalProps) {
  const router = useRouter()
  const { isConnected, connectWallet } = useWallet()
  const { addProject } = useProjects()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    methodology: "",
    impact: "",
    fundingType: "donation",
    fundingGoal: "",
    dataAccess: "public",
  })
  
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: `ms-${Date.now()}`,
      name: "",
      targetProgress: "",
      phaseId: "phase-1",
      kpis: [{ metric: "", target: "" }]
    }
  ])
  
  const [phases, setPhases] = useState([
    { id: "phase-1", name: "Phase 1" },
    { id: "phase-2", name: "Phase 2" },
    { id: "phase-3", name: "Phase 3" },
  ])

  // Add a new milestone
  const addMilestone = useCallback(() => {
    setMilestones(prev => [
      ...prev,
      {
        id: `ms-${Date.now()}-${prev.length}`,
        name: "",
        targetProgress: "",
        phaseId: "phase-1",
        kpis: [{ metric: "", target: "" }]
      }
    ])
  }, [])

  // Remove a milestone
  const removeMilestone = useCallback((index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Add a KPI to a milestone
  const addKPI = useCallback((milestoneIndex: number) => {
    setMilestones(prev => {
      const updated = [...prev]
      updated[milestoneIndex].kpis.push({ metric: "", target: "" })
      return updated
    })
  }, [])

  // Remove a KPI from a milestone
  const removeKPI = useCallback((milestoneIndex: number, kpiIndex: number) => {
    setMilestones(prev => {
      const updated = [...prev]
      updated[milestoneIndex].kpis = updated[milestoneIndex].kpis.filter((_, i) => i !== kpiIndex)
      return updated
    })
  }, [])

  // Update milestone data
  const updateMilestone = useCallback((index: number, field: keyof Milestone, value: string) => {
    setMilestones(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  // Update KPI data
  const updateKPI = useCallback((milestoneIndex: number, kpiIndex: number, field: keyof KPI, value: string) => {
    setMilestones(prev => {
      const updated = [...prev]
      updated[milestoneIndex].kpis[kpiIndex] = { 
        ...updated[milestoneIndex].kpis[kpiIndex], 
        [field]: value 
      }
      return updated
    })
  }, [])

  const handleSubmit = async () => {
    if (!isConnected) {
      return
    }

    setIsSubmitting(true)
    try {
      // Create new project in the context
      const newProject = await addProject({
        title: formData.title,
        fundingGoal: Number(formData.fundingGoal),
        fundingRaised: 0,
        status: "funding",
        progress: 0,
        nextMilestone: {
          title: "Initial Funding Goal",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
          fundingLocked: Number(formData.fundingGoal),
        },
        dataUploads: [],
      })

      // Create milestones in the smart contract
      try {
        // Get the provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        // Get the contract address from environment variables
        const contractAddress = process.env.NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS || ''
        if (!contractAddress) {
          throw new Error("Contract address not found in environment variables")
        }
        
        // Get the contract ABI
        const contractABI = require("@/contracts/DeSciDataABI.json")
        
        // Create contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        
        // Create each milestone in the contract
        for (const milestone of milestones) {
          if (!milestone.name || !milestone.targetProgress) continue
          
          // Format KPIs for the contract
          const kpis = milestone.kpis.filter(kpi => kpi.metric && kpi.target).map(kpi => ({
            metric: kpi.metric,
            target: ethers.parseUnits(kpi.target, 0), // Convert to BigNumber
            current: ethers.parseUnits("0", 0) // Initialize current to 0
          }))
          
          // Call the contract to create the milestone
          await contract.createMilestone(
            milestone.id,
            milestone.name,
            ethers.parseUnits(milestone.targetProgress, 0),
            kpis,
            milestone.phaseId
          )
        }
      } catch (contractError) {
        console.error("Error creating milestones in contract:", contractError)
        toast({
          title: "Contract Error",
          description: "Project created but failed to initialize milestones in the smart contract.",
          variant: "destructive",
        })
      }

      // Show success message
      toast({
        title: "Project Created",
        description: "Your new research project has been created successfully with milestones.",
      })

      // Close modal and redirect to portfolio
      onClose()
      router.push("/portfolio")
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Please connect your wallet to create a new research project.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <Button onClick={connectWallet} size="lg">
              <Wallet className="mr-2 h-4 w-4" />
              Connect MetaMask
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Experiment</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Define your experiment objectives and methodology"
              : step === 2
                ? "Set up funding requirements"
                : "Configure data access settings"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Experiment Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter experiment title"
                />
              </div>
              <div>
                <Label htmlFor="objective">Research Objective</Label>
                <Textarea
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Describe your research direction and goals"
                />
              </div>
              <div>
                <Label htmlFor="methodology">Methodology</Label>
                <Textarea
                  id="methodology"
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  placeholder="Describe your experimental methods"
                />
              </div>
              <div>
                <Label htmlFor="impact">Expected Impact</Label>
                <Textarea
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="Describe the potential impact of your research"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Funding Type</Label>
                <RadioGroup
                  value={formData.fundingType}
                  onValueChange={(value) => setFormData({ ...formData, fundingType: value })}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donation" id="donation" />
                    <Label htmlFor="donation">Donation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investment" id="investment" />
                    <Label htmlFor="investment">Investment</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="fundingGoal">Funding Goal ($EDU)</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  placeholder="Enter funding goal in $EDU"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Milestones</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addMilestone}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Milestone
                  </Button>
                </div>
                
                <Accordion type="multiple" className="w-full">
                  {milestones.map((milestone, milestoneIndex) => (
                    <AccordionItem key={milestone.id} value={milestone.id} className="border rounded-md p-2 mb-4">
                      <div className="flex justify-between items-center">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="font-medium">
                            {milestone.name || `Milestone ${milestoneIndex + 1}`}
                          </span>
                        </AccordionTrigger>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMilestone(milestoneIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          <div>
                            <Label htmlFor={`milestone-name-${milestoneIndex}`}>Milestone Name</Label>
                            <Input
                              id={`milestone-name-${milestoneIndex}`}
                              value={milestone.name}
                              onChange={(e) => updateMilestone(milestoneIndex, 'name', e.target.value)}
                              placeholder="Enter milestone name"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`milestone-progress-${milestoneIndex}`}>Target Progress (%)</Label>
                            <Input
                              id={`milestone-progress-${milestoneIndex}`}
                              type="number"
                              min="0"
                              max="100"
                              value={milestone.targetProgress}
                              onChange={(e) => updateMilestone(milestoneIndex, 'targetProgress', e.target.value)}
                              placeholder="Enter target progress percentage"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`milestone-phase-${milestoneIndex}`}>Phase</Label>
                            <Select 
                              value={milestone.phaseId} 
                              onValueChange={(value) => updateMilestone(milestoneIndex, 'phaseId', value)}
                            >
                              <SelectTrigger id={`milestone-phase-${milestoneIndex}`} className="mt-1">
                                <SelectValue placeholder="Select phase" />
                              </SelectTrigger>
                              <SelectContent>
                                {phases.map(phase => (
                                  <SelectItem key={phase.id} value={phase.id}>
                                    {phase.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Key Performance Indicators (KPIs)</Label>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => addKPI(milestoneIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add KPI
                              </Button>
                            </div>
                            
                            {milestone.kpis.map((kpi, kpiIndex) => (
                              <Card key={`kpi-${milestoneIndex}-${kpiIndex}`} className="p-2">
                                <CardContent className="p-2 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="font-medium">KPI {kpiIndex + 1}</Label>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeKPI(milestoneIndex, kpiIndex)}
                                      className="text-destructive h-6 w-6 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label htmlFor={`kpi-metric-${milestoneIndex}-${kpiIndex}`} className="text-xs">Metric</Label>
                                      <Input
                                        id={`kpi-metric-${milestoneIndex}-${kpiIndex}`}
                                        value={kpi.metric}
                                        onChange={(e) => updateKPI(milestoneIndex, kpiIndex, 'metric', e.target.value)}
                                        placeholder="e.g., User Count"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`kpi-target-${milestoneIndex}-${kpiIndex}`} className="text-xs">Target Value</Label>
                                      <Input
                                        id={`kpi-target-${milestoneIndex}-${kpiIndex}`}
                                        type="number"
                                        value={kpi.target}
                                        onChange={(e) => updateKPI(milestoneIndex, kpiIndex, 'target', e.target.value)}
                                        placeholder="e.g., 1000"
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Data Access Type</Label>
                <Select
                  value={formData.dataAccess}
                  onValueChange={(value) => setFormData({ ...formData, dataAccess: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data access type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Access</SelectItem>
                    <SelectItem value="timed">Time-Limited Access</SelectItem>
                    <SelectItem value="supporters">Supporters Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertDescription>
                  After creation, this project will appear in your portfolio where you can track its progress, manage
                  funding, and upload research data.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1 || isSubmitting}>
            Back
          </Button>
          <Button
            onClick={() => {
              if (step < 3) setStep(step + 1)
              else handleSubmit()
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Project...
              </>
            ) : step === 3 ? (
              "Create Experiment"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

