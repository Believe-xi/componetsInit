// 核心素养
export interface LiteracyItem {
    QuestionId: string // 题目Id
    LiteracyId: string // 核心素养Id
    LiteracyName: number // 核心素养名称
    Percent: number // 占比
}

export interface QuestionTypeAndCountsItem {
    QuestionType: string // 题目类型
    QuestionTypeName: string // 题目类型
    QuestionCount: number // 题目数量
    QuestionTotalSocre: number // 该类型题目总分
    Sorts: string[] // 该题目序号
}

// 能力层级
export interface AbilityLevelItem {
    AbilityId: string // 能力层级Id
    AbilityName: string // 认知水平或亚类名称
    Percent: number // 占比
    AbilityChartDtos: AbilityLevelItem[]
}

export const hardLevelOptions = [
    { Id: '1', Name: '简单' },
    { Id: '2', Name: '一般' },
    { Id: '3', Name: '中等' },
    { Id: '4', Name: '困难' },
    { Id: '5', Name: '特难' }
]

// 难度类型和占比集合
export interface DifficultyTypeAndCountsItem {
    DifficultyType: string // 难度类型
    Proportion: number // 占比
}
/**
 * LiteracyDescripDetailDto，核心素养详情
 */
export interface LiteracyDescripDetailDto {
    PortraitPointDetailDtoNew: portraitPointDetailDtoN
    PortraitPointTreeOutDto: PortraitPointTreeOutDto[]
}

export interface KonwledgeAndQuestionCountsItem {
    KonwledgeId: string // 知识点id
    KonwledgeName: string // 知识点名
    QuestionCount: number // 题目个数
}
export interface portraitPointDetailDtoN {
    /**
     * 难度因素
     */
    Difficulties: IDNameDTO[] 
    /**
     * 二级指标相关
     */
    PortraitPointDetailItemDtos: PortraitPointDetailItemDtos[] 
}

export interface IDNameDTO {
    /**
     * ID
     */
    Id:  string
    /**
     * 名称
     */
    Name:  string
}

/**
 * PortraitPointDetailItemDtos
 */
export interface PortraitPointDetailItemDtos {
    [key: string]: string | number | QuestionDifficulty[] | TargetAndPoints[]
    /**
     * 能力层级Id
     */
    AbilityLevelId: string
    /**
     * 能力层级名称
     */
    AbilityLevelName: string
    /**
     * 难度总值
     */
    DifficultyTotalValue: number
    /**
     * 难度模型
     */
    QuestionDifficulties: QuestionDifficulty[]
    /**
     * 题号
     */
    QuestionSort: string
    /**
     * 题型Id
     */
    QuestionTypeId: string
    /**
     * 题型名称
     */
    QuestionTypeName: string
    /**
     * 卷面分数（组卷无此项）
     */
    Score: number
    TargetAndPoints: TargetAndPoints[]
    targetPointName: string
    targetPointId: string
    num: number // 相同题目的数量
    numNo: number // 第一个相同题目的index
}

export interface TargetAndPoints {
    TargetPointId: string
    TargetPointName: string
    Sort: number
    Type: number
}

/**
 * QuestionDetail，题目相关
 */
export interface QuestionDetail {
    /**
     * 题目难度相关
     */
    DifficultyRelateds: DifficultyRelated[] 
    /**
     * 题目数量
     */
    Num: number
    /**
     * 题型Id
     */
    QuestionTypeId:  string
    /**
     * 题型名称
     */
    QuestionTypeName:  string
}

/**
 * DifficultyRelated，题号难度及总分
 */
export interface DifficultyRelated {
    /**
     * 难度值
     */
    DifficultyTotalValue: number 
    QuestionDifficulties: QuestionDifficulty[] 
    /**
     * 题号
     */
    QuestionSort:  string
}

/**
 * QuestionDifficulty，题目关联难度因素
 */
export interface QuestionDifficulty {
    /**
     * 难度因素ID
     */
    DifficultyFactoryId:  string
    /**
     * 难度因素名称
     */
    DifficultyFactoryName:  string
    /**
     * 难度水平ID
     */
    DifficultyId:  string
    /**
     * 难度水平名称
     */
    DifficultyName:  string
    /**
     * 难度水平分值
     */
    DifficultyValue: number 
    /**
     * 评价中心里难度因素排序
     */
    Sort: number
}

/**
 * PortraitPointTreeOutDto，评价指标、观测点数据出参(树型结构)
 */
export interface PortraitPointTreeOutDto {
    /**
     * 孩子节点
     */
    Children: PortraitPointTreeOutDto[] 
    /**
     * 内涵
     */
    Content:  string
    /**
     * 唯一标识Id
     */
    Id:  string
    /**
     * 是否关联题目
     */
    IsLight: boolean
    /**
     * 节点深度
     */
    Level: number 
    /**
     * 父Id
     */
    ParentId:  string
    /**
     * 指标/观测点父级id集合(逗号分割)
     */
    ParentIds:  string
    /**
     * 指标/观测点父级名称
     */
    ParentName:  string
    /**
     * 指标/观测点父级名称集合(逗号分割)
     */
    ParentNames:  string
    /**
     * 占比
     */
    Percent: number
    /**
     * 显示的内容
     */
    Text:  string
    /**
     * 类型 1指标 2观测点
     */
    Type: number
    /**
     * 数据值
     */
    Value:  string
}
