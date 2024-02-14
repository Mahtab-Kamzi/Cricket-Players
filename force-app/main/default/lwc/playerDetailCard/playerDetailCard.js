import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_PLAYER_CHANEL from '@salesforce/messageChannel/SelectedPlayer__c';


export default class PlayerDetailCard extends LightningElement {

    @wire(MessageContext)
    messageContext;

    connectedCallback(){

        subscribe(
            this.messageContext,
            SELECTED_PLAYER_CHANEL,
            (message)=>{
                console.log('Message From LMS: '+JSON.stringify(message))
            }
        )
    }

}