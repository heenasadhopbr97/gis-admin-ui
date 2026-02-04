export interface DunningManagement {
  bccemail: string,              // Text area Non mandatory
  collagencyemail: string,     // Text area mandatory
  commemail: string,           // Text area mandatory
  commsms: string,             // Text area mandatory
  creditclass: string,         // Gold , Silver , Platinum dropdown
  delete: boolean,
  dunningRuleActionPojoList: [   // Multiple Object, 1 atleast
    {
      action: string,      // Email or SMS
      days:  number,             // Number mandatory 
      emailsub: string,   // Text Mandatory
      dunningRuleId: number,
      id: number
    }
  ],
  errCode: number,
  errMessage: string,
  id: number,
  escstaffemail: string,     // Text area mandatory
  fromemail: string,         // Text area mandatory
  internalpayemail: string,  // Text area mandatory
  name: string,              // Text area mandatory
  status: string             // Active or InActive dropdown
}

