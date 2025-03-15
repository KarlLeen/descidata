import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Filter, Search, SortDesc } from "lucide-react"

export default function DataPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Research Data</h1>
          <p className="text-muted-foreground">
            Browse decentralized scientific datasets or share your own research data with the community.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search datasets..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <SortDesc className="h-4 w-4" />
              <span className="sr-only">Sort</span>
            </Button>
          </div>
          <Button style={{ backgroundColor: "hsl(var(--orange))" }}>Upload Data</Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Datasets</TabsTrigger>
            <TabsTrigger value="open">Open Access</TabsTrigger>
            <TabsTrigger value="restricted">Restricted Access</TabsTrigger>
            <TabsTrigger value="my-data">My Data</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets.map((dataset, index) => (
                <DatasetCard key={index} dataset={dataset} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="open" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((ds) => ds.accessType === "open")
                .map((dataset, index) => (
                  <DatasetCard key={index} dataset={dataset} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="restricted" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {datasets
                .filter((ds) => ds.accessType === "restricted")
                .map((dataset, index) => (
                  <DatasetCard key={index} dataset={dataset} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="my-data" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Connect your wallet to view your uploaded datasets</p>
              <Button variant="outline" className="mt-4">
                Connect Wallet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface Dataset {
  title: string
  description: string
  category: string
  size: string
  format: string
  accessType: "open" | "restricted"
  citations: number
  downloads: number
  author: {
    name: string
    institution: string
  }
  ipfsHash: string
  dateUploaded: string
}

const datasets: Dataset[] = [
  {
    title: "Quantum Algorithm Performance Benchmarks",
    description: "Benchmark data comparing various quantum algorithms for molecular simulations.",
    category: "Quantum Computing",
    size: "2.4 GB",
    format: "CSV, JSON",
    accessType: "open",
    citations: 12,
    downloads: 156,
    author: {
      name: "Dr. Sarah Chen",
      institution: "Quantum Research Institute",
    },
    ipfsHash: "QmX7b5jxn6Vd...",
    dateUploaded: "2023-10-15",
  },
  {
    title: "Coral Reef Temperature Variations (2010-2023)",
    description: "Time series data of temperature variations in major coral reef ecosystems.",
    category: "Environmental Science",
    size: "5.7 GB",
    format: "CSV, NetCDF",
    accessType: "open",
    citations: 28,
    downloads: 342,
    author: {
      name: "Prof. Michael Torres",
      institution: "Ocean Sciences Laboratory",
    },
    ipfsHash: "QmY8c6jzm7Wd...",
    dateUploaded: "2023-09-22",
  },
  {
    title: "Neural Imaging Dataset for Alzheimer's Research",
    description: "Anonymized brain scans with early markers of neurodegenerative diseases.",
    category: "Neuroscience",
    size: "18.3 GB",
    format: "DICOM, NIfTI",
    accessType: "restricted",
    citations: 45,
    downloads: 89,
    author: {
      name: "Dr. Emily Johnson",
      institution: "Neural Health Research Center",
    },
    ipfsHash: "QmZ9d7kxn8Ve...",
    dateUploaded: "2023-11-05",
  },
  {
    title: "Sustainable Building Materials Properties",
    description: "Physical and chemical properties of eco-friendly construction materials.",
    category: "Materials Science",
    size: "1.2 GB",
    format: "CSV, XLS",
    accessType: "open",
    citations: 8,
    downloads: 124,
    author: {
      name: "Dr. Robert Kim",
      institution: "Sustainable Materials Lab",
    },
    ipfsHash: "QmA1b2c3d4e5...",
    dateUploaded: "2023-08-30",
  },
  {
    title: "CRISPR-Modified Crop Genome Sequences",
    description: "Genomic data from drought-resistant crop varieties developed using CRISPR.",
    category: "Agricultural Biotechnology",
    size: "7.8 GB",
    format: "FASTA, GenBank",
    accessType: "restricted",
    citations: 32,
    downloads: 67,
    author: {
      name: "Dr. Lisa Patel",
      institution: "Agricultural Genomics Center",
    },
    ipfsHash: "QmB2c3d4e5f6...",
    dateUploaded: "2023-10-10",
  },
  {
    title: "Microplastics Concentration in Global Water Samples",
    description: "Measurements of microplastic particles in drinking water from 50 countries.",
    category: "Environmental Engineering",
    size: "3.5 GB",
    format: "CSV, JSON",
    accessType: "open",
    citations: 19,
    downloads: 215,
    author: {
      name: "Prof. James Wilson",
      institution: "Water Quality Research Lab",
    },
    ipfsHash: "QmC3d4e5f6g7...",
    dateUploaded: "2023-09-15",
  },
]

function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium text-primary">{dataset.category}</div>
            <CardTitle className="line-clamp-1 mt-1">{dataset.title}</CardTitle>
          </div>
          <Badge variant={dataset.accessType === "open" ? "outline" : "secondary"}>
            {dataset.accessType === "open" ? "Open Access" : "Restricted"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{dataset.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Size</div>
              <div>{dataset.size}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Format</div>
              <div>{dataset.format}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Citations</div>
              <div>{dataset.citations}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Downloads</div>
              <div>{dataset.downloads}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">By {dataset.author?.name || '未知'}</div>
            <div className="text-sm text-muted-foreground">{dataset.dateUploaded}</div>
          </div>
          <div className="text-xs text-muted-foreground truncate">IPFS: {dataset.ipfsHash}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button variant="outline" size="sm">
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

