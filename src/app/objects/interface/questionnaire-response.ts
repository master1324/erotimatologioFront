export interface QuestionnaireResponse{

    id:number;
    questionnaireId:number;
    userId:number;
    filter:string;
    decodedFilter?:Record<string,string>;
}