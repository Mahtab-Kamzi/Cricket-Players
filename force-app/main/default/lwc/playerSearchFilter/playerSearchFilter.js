import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CRICKETER_OBJECT from '@salesforce/schema/Cricketer__c';
import NATIONALITY_FIELD from '@salesforce/schema/Cricketer__c.Nationality__c';

export default class PlayerSearchFilter extends NavigationMixin(LightningElement) {
    recordTypeId;
    picklistValues;
    optionArrays;
    selectedCricketerNationality = '';
    selectedPlayerId;
    selectedPlayerName;
    @wire(getObjectInfo, { objectApiName: CRICKETER_OBJECT })
    objectInfos({data, error}){
        if(error){
            console.log('error;'+JSON.stringify(error))
        }else if(data){
            this.recordTypeId = data.defaultRecordTypeId;
            console.log('recordTypeId:'+JSON.stringify(this.recordTypeId))
        }
    }
    @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: NATIONALITY_FIELD })
    natinalityFieldValues({ data, error}){ 
        if(error){
            console.log('error;'+JSON.stringify(error))
        }else if(data){
            let arr = [];
            this.picklistValues = data.values;
            console.log('picklist data: '+JSON.stringify(this.picklistValues))
            this.picklistValues.forEach(element => {
                arr.push({ label : element.value, value : element.value})
            })
            this.optionArrays = arr;
        }
    }
    createCricketers(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes:{
                objectApiName: 'Cricketer__c',
                actionName: 'new'
            }
        })
    }
    handleOptionChange(event){
        this.selectedCricketerNationality = event.detail.value;
        console.log('this.selectedCricketerNationality: '+JSON.stringify(this.selectedCricketerNationality))        
        this.template.querySelector('c-player-search-result').searchCricketer(this.selectedCricketerNationality);
    }
    handleCustomEvent(event){
        this.selectedPlayerId = event.detail.playerId;
        this.selectedPlayerName = event.detail.playerName;
        console.log('this.selectedPlayerId : '+JSON.stringify(this.selectedPlayerId))
        console.log('Player Name: ' + JSON.stringify(this.selectedPlayerName));

    }
}