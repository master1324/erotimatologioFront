import { Identifier } from "./identifier";
import { QuestionGroup } from "./question_group";

export class Questionnaire{

    id:number;
    name:string;
    questionnaire?:QuestionGroup[];
    eligibleResponsesIdentifiers?:Record<string,Identifier[]>;
}