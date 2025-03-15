// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DeSciData
 * @dev A platform for decentralized science data storage, funding, and provenance tracking
 */
contract DeSciData is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    
    Counters.Counter private _experimentIds;
    Counters.Counter private _datasetIds;
    
    // Financial policy constants
    uint256 public constant PLATFORM_FEE_PERCENT = 5; // 5% platform fee
    uint256 public constant RESEARCHER_PROFIT_SHARE = 70; // 70% of profits to researchers
    uint256 public constant SPONSOR_PROFIT_SHARE = 20; // 20% of profits to sponsors
    uint256 public constant PLATFORM_RESERVE_SHARE = 10; // 10% to platform reserve
    
    // Experiments
    struct Experiment {
        uint256 id;
        string title;
        string description;
        address researcher;
        uint256 fundingGoal;
        uint256 fundingRaised;
        uint256 deadline;
        bool fundingComplete;
        bool isActive;
        uint256[] datasets;
        address[] contributors;
        mapping(address => uint256) contributions;
    }
    
    // Datasets
    struct DatasetInfo {
        uint256 id;
        uint256 experimentId;
        string title;
        string description;
        string dataURI;       // IPFS or other decentralized storage URI
        address owner;
        bool isNFTized;
        uint256 accessPrice;  // Price to access the data if not open
        bool isOpenAccess;
        uint256 citationCount;
        address[] authorized; // Addresses authorized to access the data
    }
    
    // Citations
    struct Citation {
        uint256 citingDataset;
        uint256 citedDataset;
        address citer;
        uint256 timestamp;
    }
    
    // Storage
    mapping(uint256 => Experiment) private experiments;
    mapping(uint256 => DatasetInfo) private datasets;
    mapping(uint256 => Citation[]) private citations;
    mapping(address => uint256[]) private researcherExperiments;
    mapping(address => uint256[]) private researcherDatasets;
    
    // KPI structure
    struct KPI {
        string metric;
        uint256 target;
        uint256 current;
    }

    // Milestone structure
    struct Milestone {
        string id;
        string name;
        uint256 targetProgress;
        uint256 currentProgress;
        KPI[] kpis;
        bool exists;
    }

    // Project management mappings
    mapping(string => Milestone) private milestones;
    mapping(string => string[]) private phaseMilestones;
    mapping(address => bool) private projectManagers;
    
    // Financial management
    uint256 private platformReserve;
    uint256 private totalInvestedFunds;
    uint256 private totalYield;
    uint256 private lastDistributionTimestamp;
    mapping(address => uint256) private researcherProfitShares;
    mapping(address => uint256) private sponsorProfitShares;
    
    // Audit trail for financial transparency
    struct FinancialTransaction {
        uint256 timestamp;
        string transactionType; // "fee", "investment", "yield", "distribution"
        uint256 amount;
        address recipient;
        string description;
    }
    FinancialTransaction[] private financialTransactions;

    // Events
    event ExperimentCreated(uint256 indexed experimentId, address indexed researcher, string title);
    event FundingContributed(uint256 indexed experimentId, address indexed contributor, uint256 amount);
    event FundingGoalReached(uint256 indexed experimentId, uint256 totalRaised);
    event DatasetUploaded(uint256 indexed datasetId, uint256 indexed experimentId, address indexed researcher);
    event DatasetNFTized(uint256 indexed datasetId, address indexed owner);
    event DatasetCited(uint256 indexed citingDataset, uint256 indexed citedDataset, address indexed citer);
    event AccessGranted(uint256 indexed datasetId, address indexed user);
    event MilestoneCreated(string indexed milestoneId, string name);
    event MilestoneProgressUpdated(string indexed milestoneId, uint256 progress);
    event MilestoneKPIUpdated(string indexed milestoneId, uint256 kpiIndex, uint256 value);
    event PlatformFeeCollected(uint256 experimentId, uint256 amount);
    event FundsRefunded(uint256 experimentId, address contributor, uint256 amount);
    event YieldGenerated(uint256 amount, uint256 timestamp);
    event ProfitDistributed(uint256 researcherAmount, uint256 sponsorAmount, uint256 platformAmount);
    
    constructor() ERC721("DeSciData Dataset", "DSD") {
        projectManagers[msg.sender] = true;
    }
    
    /**
     * @dev Create a new experiment
     * @param _title Experiment title
     * @param _description Experiment description
     * @param _fundingGoal Funding goal in wei
     * @param _durationInDays Duration of funding period in days
     */
    function createExperiment(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _durationInDays
    ) public {
        _experimentIds.increment();
        uint256 newExperimentId = _experimentIds.current();
        
        Experiment storage newExperiment = experiments[newExperimentId];
        newExperiment.id = newExperimentId;
        newExperiment.title = _title;
        newExperiment.description = _description;
        newExperiment.researcher = msg.sender;
        newExperiment.fundingGoal = _fundingGoal;
        newExperiment.fundingRaised = 0;
        newExperiment.deadline = block.timestamp + (_durationInDays * 1 days);
        newExperiment.fundingComplete = false;
        newExperiment.isActive = true;
        
        researcherExperiments[msg.sender].push(newExperimentId);
        
        emit ExperimentCreated(newExperimentId, msg.sender, _title);
    }
    
    /**
     * @dev Contribute funding to an experiment
     * @param _experimentId ID of the experiment to fund
     */
    function fundExperiment(uint256 _experimentId) public payable nonReentrant {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(experiments[_experimentId].isActive, "Experiment is not active");
        require(block.timestamp < experiments[_experimentId].deadline, "Funding deadline has passed");
        require(!experiments[_experimentId].fundingComplete, "Funding goal already reached");
        
        Experiment storage experiment = experiments[_experimentId];
        
        // Add contribution
        experiment.fundingRaised = experiment.fundingRaised.add(msg.value);
        
        // Add contributor if not already added
        bool isNewContributor = true;
        for (uint i = 0; i < experiment.contributors.length; i++) {
            if (experiment.contributors[i] == msg.sender) {
                isNewContributor = false;
                break;
            }
        }
        
        if (isNewContributor) {
            experiment.contributors.push(msg.sender);
        }
        
        // Update contributions mapping
        experiment.contributions[msg.sender] = experiment.contributions[msg.sender].add(msg.value);
        
        // Check if funding goal is reached
        if (experiment.fundingRaised >= experiment.fundingGoal) {
            experiment.fundingComplete = true;
            emit FundingGoalReached(_experimentId, experiment.fundingRaised);
        }
        
        emit FundingContributed(_experimentId, msg.sender, msg.value);
    }
    
    /**
     * @dev Process successful experiment funding
     * @param _experimentId ID of the experiment
     */
    function processFundingSuccess(uint256 _experimentId) public nonReentrant {
        Experiment storage experiment = experiments[_experimentId];
        require(experiment.fundingComplete, "Funding goal not reached");
        require(experiment.isActive, "Experiment is not active");
        
        // Calculate platform fee (5%)
        uint256 platformFee = experiment.fundingRaised.mul(PLATFORM_FEE_PERCENT).div(100);
        uint256 researchAmount = experiment.fundingRaised.sub(platformFee);
        
        // Add to platform reserve
        platformReserve = platformReserve.add(platformFee);
        
        // Add to total invested funds for yield calculation
        totalInvestedFunds = totalInvestedFunds.add(researchAmount);
        
        // Record transaction for audit trail
        financialTransactions.push(FinancialTransaction({
            timestamp: block.timestamp,
            transactionType: "fee",
            amount: platformFee,
            recipient: address(this),
            description: "Platform fee from experiment funding"
        }));
        
        // Transfer research funds to researcher
        payable(experiment.researcher).transfer(researchAmount);
        
        // Record transaction for audit trail
        financialTransactions.push(FinancialTransaction({
            timestamp: block.timestamp,
            transactionType: "investment",
            amount: researchAmount,
            recipient: experiment.researcher,
            description: "Research funding transferred to researcher"
        }));
        
        emit PlatformFeeCollected(_experimentId, platformFee);
    }
    
    /**
     * @dev Refund contributions if experiment fails to meet funding goal
     * @param _experimentId ID of the experiment
     */
    function refundContributions(uint256 _experimentId) public nonReentrant {
        Experiment storage experiment = experiments[_experimentId];
        require(experiment.isActive, "Experiment is not active");
        require(block.timestamp > experiment.deadline, "Funding deadline has not passed");
        require(!experiment.fundingComplete, "Funding goal was reached");
        
        uint256 contributionAmount = experiment.contributions[msg.sender];
        require(contributionAmount > 0, "No contribution to refund");
        
        // Reset contribution
        experiment.contributions[msg.sender] = 0;
        
        // Record transaction for audit trail
        financialTransactions.push(FinancialTransaction({
            timestamp: block.timestamp,
            transactionType: "refund",
            amount: contributionAmount,
            recipient: msg.sender,
            description: "Refund for failed experiment funding"
        }));
        
        // Transfer refund
        payable(msg.sender).transfer(contributionAmount);
        
        emit FundsRefunded(_experimentId, msg.sender, contributionAmount);
    }
    
    /**
     * @dev Upload a dataset for an experiment
     * @param _experimentId ID of the experiment
     * @param _title Dataset title
     * @param _description Dataset description
     * @param _dataURI URI to the dataset on decentralized storage
     * @param _accessPrice Price to access the dataset (0 for open access)
     * @param _isOpenAccess Whether the dataset is open access
     */
    function uploadDataset(
        uint256 _experimentId,
        string memory _title,
        string memory _description,
        string memory _dataURI,
        uint256 _accessPrice,
        bool _isOpenAccess
    ) public {
        require(experiments[_experimentId].isActive, "Experiment is not active");
        require(experiments[_experimentId].researcher == msg.sender, "Only the researcher can upload datasets");
        
        _datasetIds.increment();
        uint256 newDatasetId = _datasetIds.current();
        
        DatasetInfo storage newDataset = datasets[newDatasetId];
        newDataset.id = newDatasetId;
        newDataset.experimentId = _experimentId;
        newDataset.title = _title;
        newDataset.description = _description;
        newDataset.dataURI = _dataURI;
        newDataset.owner = msg.sender;
        newDataset.isNFTized = false;
        newDataset.accessPrice = _accessPrice;
        newDataset.isOpenAccess = _isOpenAccess;
        newDataset.citationCount = 0;
        
        // Add researcher to authorized list
        newDataset.authorized.push(msg.sender);
        
        // Update experiment datasets
        experiments[_experimentId].datasets.push(newDatasetId);
        
        // Update researcher datasets
        researcherDatasets[msg.sender].push(newDatasetId);
        
        emit DatasetUploaded(newDatasetId, _experimentId, msg.sender);
    }
    
    /**
     * @dev Convert a dataset to an NFT
     * @param _datasetId ID of the dataset to NFTize
     * @param _tokenURI Metadata URI for the NFT
     */
    function nftizeDataset(uint256 _datasetId, string memory _tokenURI) public {
        require(datasets[_datasetId].owner == msg.sender, "Only the dataset owner can NFTize it");
        require(!datasets[_datasetId].isNFTized, "Dataset is already NFTized");
        
        // Mint NFT to dataset owner
        _safeMint(msg.sender, _datasetId);
        _setTokenURI(_datasetId, _tokenURI);
        
        // Update dataset status
        datasets[_datasetId].isNFTized = true;
        
        emit DatasetNFTized(_datasetId, msg.sender);
    }
    
    /**
     * @dev Cite a dataset within another dataset
     * @param _citingDatasetId ID of the dataset that is citing
     * @param _citedDatasetId ID of the dataset being cited
     */
    function citeDataset(uint256 _citingDatasetId, uint256 _citedDatasetId) public {
        require(datasets[_citingDatasetId].owner == msg.sender, "Only the dataset owner can create citations");
        require(_citingDatasetId != _citedDatasetId, "Cannot cite itself");
        
        // Create new citation
        Citation memory newCitation = Citation({
            citingDataset: _citingDatasetId,
            citedDataset: _citedDatasetId,
            citer: msg.sender,
            timestamp: block.timestamp
        });
        
        // Add citation to cited dataset
        citations[_citedDatasetId].push(newCitation);
        
        // Increment citation count for cited dataset
        datasets[_citedDatasetId].citationCount++;
        
        emit DatasetCited(_citingDatasetId, _citedDatasetId, msg.sender);
    }
    
    /**
     * @dev Purchase access to a dataset
     * @param _datasetId ID of the dataset to access
     */
    function purchaseDataAccess(uint256 _datasetId) public payable nonReentrant {
        require(!datasets[_datasetId].isOpenAccess, "Dataset is open access, no purchase needed");
        require(msg.value >= datasets[_datasetId].accessPrice, "Insufficient payment");
        
        // Check if user already has access
        bool userHasAccess = false;
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == msg.sender) {
                userHasAccess = true;
                break;
            }
        }
        
        require(!userHasAccess, "User already has access");
        
        // Add user to authorized list
        datasets[_datasetId].authorized.push(msg.sender);
        
        // Transfer payment to dataset owner
        payable(datasets[_datasetId].owner).transfer(msg.value);
        
        emit AccessGranted(_datasetId, msg.sender);
    }
    
    /**
     * @dev Grant access to a dataset
     * @param _datasetId ID of the dataset
     * @param _user Address of the user to grant access
     */
    function grantAccess(uint256 _datasetId, address _user) public {
        require(datasets[_datasetId].owner == msg.sender, "Only the dataset owner can grant access");
        
        // Check if user already has access
        bool userHasAccess = false;
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == _user) {
                userHasAccess = true;
                break;
            }
        }
        
        require(!userHasAccess, "User already has access");
        
        // Add user to authorized list
        datasets[_datasetId].authorized.push(_user);
        
        emit AccessGranted(_datasetId, _user);
    }
    
    /**
     * @dev Check if user has access to a dataset
     * @param _datasetId ID of the dataset
     * @param _user Address of the user
     * @return Whether the user has access
     */
    function hasAccess(uint256 _datasetId, address _user) public view returns (bool) {
        if (datasets[_datasetId].isOpenAccess) {
            return true;
        }
        
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == _user) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Get experiment details
     * @param _experimentId ID of the experiment
     * @return title The experiment title
     * @return description The experiment description
     * @return researcher The researcher address
     * @return fundingGoal The funding goal amount
     * @return fundingRaised The current funding raised
     * @return deadline The funding deadline timestamp
     * @return fundingComplete Whether funding is complete
     * @return isActive Whether the experiment is active
     * @return datasetIds Array of dataset IDs
     * @return contributors Array of contributor addresses
     */
    function getExperiment(uint256 _experimentId) public view returns (
        string memory title,
        string memory description,
        address researcher,
        uint256 fundingGoal,
        uint256 fundingRaised,
        uint256 deadline,
        bool fundingComplete,
        bool isActive,
        uint256[] memory datasetIds,
        address[] memory contributors
    ) {
        Experiment storage experiment = experiments[_experimentId];
        return (
            experiment.title,
            experiment.description,
            experiment.researcher,
            experiment.fundingGoal,
            experiment.fundingRaised,
            experiment.deadline,
            experiment.fundingComplete,
            experiment.isActive,
            experiment.datasets,
            experiment.contributors
        );
    }
    
    /**
     * @dev Get dataset details
     * @param _datasetId ID of the dataset
     * @return id The dataset ID
     * @return experimentId The associated experiment ID
     * @return title The dataset title
     * @return description The dataset description
     * @return owner The dataset owner address
     * @return isNFTized Whether the dataset is NFTized
     * @return accessPrice The price to access the dataset
     * @return isOpenAccess Whether the dataset is open access
     * @return citationCount The number of citations
     */
    function getDataset(uint256 _datasetId) public view returns (
        uint256 id,
        uint256 experimentId,
        string memory title,
        string memory description,
        address owner,
        bool isNFTized,
        uint256 accessPrice,
        bool isOpenAccess,
        uint256 citationCount
    ) {
        DatasetInfo storage dataset = datasets[_datasetId];
        return (
            dataset.id,
            dataset.experimentId,
            dataset.title,
            dataset.description,
            dataset.owner,
            dataset.isNFTized,
            dataset.accessPrice,
            dataset.isOpenAccess,
            dataset.citationCount
        );
    }
    
    /**
     * @dev Get the data URI for a dataset (only if authorized)
     * @param _datasetId ID of the dataset
     * @return Data URI
     */
    function getDataURI(uint256 _datasetId) public view returns (string memory) {
        require(hasAccess(_datasetId, msg.sender), "User does not have access to this dataset");
        return datasets[_datasetId].dataURI;
    }
    
    /**
     * @dev Get all experiments by a researcher
     * @param _researcher Address of the researcher
     * @return Array of experiment IDs
     */
    function getResearcherExperiments(address _researcher) public view returns (uint256[] memory) {
        return researcherExperiments[_researcher];
    }
    
    /**
     * @dev Get all datasets by a researcher
     * @param _researcher Address of the researcher
     * @return Array of dataset IDs
     */
    function getResearcherDatasets(address _researcher) public view returns (uint256[] memory) {
        return researcherDatasets[_researcher];
    }
    
    /**
     * @dev Get the total number of experiments
     * @return Total number of experiments
     */
    function getTotalExperiments() public view returns (uint256) {
        return _experimentIds.current();
    }
    
    /**
     * @dev Get the total number of datasets
     * @return Total number of datasets
     */
    function getTotalDatasets() public view returns (uint256) {
        return _datasetIds.current();
    }
    
    /**
     * @dev Get citations for a dataset
     * @param _datasetId ID of the dataset
     * @return Array of citing dataset IDs
     */
    function getDatasetCitations(uint256 _datasetId) public view returns (uint256[] memory) {
        Citation[] memory datasetCitations = citations[_datasetId];
        uint256[] memory citingDatasets = new uint256[](datasetCitations.length);
        
        for (uint i = 0; i < datasetCitations.length; i++) {
            citingDatasets[i] = datasetCitations[i].citingDataset;
        }
        
        return citingDatasets;
    }

    // Project management modifiers
    modifier onlyProjectManager() {
        require(projectManagers[msg.sender], "Not authorized");
        _;
    }

    /**
     * @dev Add a project manager
     * @param _manager Address of the new project manager
     */
    function addProjectManager(address _manager) public onlyOwner {
        projectManagers[_manager] = true;
    }

    /**
     * @dev Remove a project manager
     * @param _manager Address of the project manager to remove
     */
    function removeProjectManager(address _manager) public onlyOwner {
        require(_manager != owner(), "Cannot remove owner");
        projectManagers[_manager] = false;
    }

    /**
     * @dev Create a new milestone and optionally add it to a phase
     * @param _id Milestone ID
     * @param _name Milestone name
     * @param _targetProgress Target progress percentage
     * @param _kpis Array of KPIs for the milestone
     * @param _phaseId Optional phase ID to add the milestone to
     */
    function createMilestone(
        string memory _id,
        string memory _name,
        uint256 _targetProgress,
        KPI[] memory _kpis,
        string memory _phaseId
    ) public onlyProjectManager {
        require(!milestones[_id].exists, "Milestone already exists");
        require(_targetProgress <= 100, "Invalid target progress");

        Milestone storage newMilestone = milestones[_id];
        newMilestone.id = _id;
        newMilestone.name = _name;
        newMilestone.targetProgress = _targetProgress;
        newMilestone.currentProgress = 0;
        newMilestone.exists = true;

        for (uint i = 0; i < _kpis.length; i++) {
            newMilestone.kpis.push(KPI({
                metric: _kpis[i].metric,
                target: _kpis[i].target,
                current: 0
            }));
        }

        // Add milestone to phase if specified
        if (bytes(_phaseId).length > 0) {
            phaseMilestones[_phaseId].push(_id);
        }

        emit MilestoneCreated(_id, _name);
    }

    /**
     * @dev Update milestone progress
     * @param _milestoneId ID of the milestone
     * @param _progress New progress value
     */
    function updateMilestoneProgress(
        string memory _milestoneId,
        uint256 _progress
    ) public onlyProjectManager {
        require(milestones[_milestoneId].exists, "Milestone does not exist");
        require(_progress <= 100, "Invalid progress value");

        milestones[_milestoneId].currentProgress = _progress;
        emit MilestoneProgressUpdated(_milestoneId, _progress);
    }

    /**
     * @dev Update milestone KPI
     * @param _milestoneId ID of the milestone
     * @param _kpiIndex Index of the KPI to update
     * @param _value New KPI value
     */
    function updateMilestoneKPI(
        string memory _milestoneId,
        uint256 _kpiIndex,
        uint256 _value
    ) public onlyProjectManager {
        require(milestones[_milestoneId].exists, "Milestone does not exist");
        require(_kpiIndex < milestones[_milestoneId].kpis.length, "Invalid KPI index");
        require(_value <= milestones[_milestoneId].kpis[_kpiIndex].target, "Value exceeds target");

        milestones[_milestoneId].kpis[_kpiIndex].current = _value;
        emit MilestoneKPIUpdated(_milestoneId, _kpiIndex, _value);
    }

    /**
     * @dev Get milestone details
     * @param _milestoneId ID of the milestone
     */
    function getMilestone(string memory _milestoneId) public view returns (Milestone memory) {
        require(milestones[_milestoneId].exists, "Milestone does not exist");
        return milestones[_milestoneId];
    }

    /**
     * @dev Calculate phase progress
     * @param _phaseId ID of the phase
     */
    function getPhaseProgress(string memory _phaseId) public view returns (uint256) {
        string[] memory phaseMilestoneIds = phaseMilestones[_phaseId];
        require(phaseMilestoneIds.length > 0, "Phase has no milestones");

        uint256 totalProgress = 0;
        for (uint i = 0; i < phaseMilestoneIds.length; i++) {
            totalProgress += milestones[phaseMilestoneIds[i]].currentProgress;
        }

        return totalProgress / phaseMilestoneIds.length;
    }
    
    /**
     * @dev Simulate yield generation from treasury bonds (admin function)
     * @param _yieldAmount Amount of yield generated
     */
    function recordYield(uint256 _yieldAmount) public onlyOwner {
        totalYield = totalYield.add(_yieldAmount);
        
        // Record transaction for audit trail
        financialTransactions.push(FinancialTransaction({
            timestamp: block.timestamp,
            transactionType: "yield",
            amount: _yieldAmount,
            recipient: address(this),
            description: "Yield from treasury bonds"
        }));
        
        emit YieldGenerated(_yieldAmount, block.timestamp);
    }
    
    /**
     * @dev Distribute profits quarterly
     */
    function distributeQuarterlyProfits() public onlyOwner {
        require(totalYield > 0, "No yield to distribute");
        require(block.timestamp >= lastDistributionTimestamp + 90 days, "Too early for distribution");
        
        uint256 researcherAmount = totalYield.mul(RESEARCHER_PROFIT_SHARE).div(100);
        uint256 sponsorAmount = totalYield.mul(SPONSOR_PROFIT_SHARE).div(100);
        uint256 platformAmount = totalYield.mul(PLATFORM_RESERVE_SHARE).div(100);
        
        // Update platform reserve
        platformReserve = platformReserve.add(platformAmount);
        
        // Reset total yield for next quarter
        totalYield = 0;
        lastDistributionTimestamp = block.timestamp;
        
        // Record transaction for audit trail
        financialTransactions.push(FinancialTransaction({
            timestamp: block.timestamp,
            transactionType: "distribution",
            amount: researcherAmount.add(sponsorAmount).add(platformAmount),
            recipient: address(this),
            description: "Quarterly profit distribution"
        }));
        
        emit ProfitDistributed(researcherAmount, sponsorAmount, platformAmount);
    }
    
    /**
     * @dev Get financial policy information
     */
    function getFinancialPolicy() public pure returns (
        uint256 platformFeePercent,
        uint256 researcherProfitShare,
        uint256 sponsorProfitShare,
        uint256 platformReserveShare
    ) {
        return (
            PLATFORM_FEE_PERCENT,
            RESEARCHER_PROFIT_SHARE,
            SPONSOR_PROFIT_SHARE,
            PLATFORM_RESERVE_SHARE
        );
    }
    
    /**
     * @dev Get financial statistics
     */
    function getFinancialStats() public view returns (
        uint256 reserve,
        uint256 investedFunds,
        uint256 currentYield,
        uint256 lastDistribution
    ) {
        return (
            platformReserve,
            totalInvestedFunds,
            totalYield,
            lastDistributionTimestamp
        );
    }
    
    /**
     * @dev Get financial transaction history (paginated)
     * @param _offset Starting index
     * @param _limit Maximum number of records to return
     */
    function getFinancialTransactions(uint256 _offset, uint256 _limit) public view returns (
        FinancialTransaction[] memory transactions
    ) {
        uint256 endIndex = _offset.add(_limit);
        if (endIndex > financialTransactions.length) {
            endIndex = financialTransactions.length;
        }
        
        uint256 resultLength = endIndex > _offset ? endIndex - _offset : 0;
        transactions = new FinancialTransaction[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            transactions[i] = financialTransactions[_offset + i];
        }
        
        return transactions;
    }
}
