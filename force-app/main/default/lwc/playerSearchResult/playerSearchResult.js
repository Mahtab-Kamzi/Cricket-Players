import { LightningElement, api, wire } from 'lwc';
import getCricketerList from '@salesforce/apex/CricketerController.getCricketerList';
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_PLAYER_CHANEL from '@salesforce/messageChannel/SelectedPlayer__c';

export default class PlayerSearchResult extends LightningElement {
    cricketersNationality = '';
    cricketersData;
    selecterPlayerId;
    selecterplayerName;
    @wire(getCricketerList, {nationality : '$cricketersNationality'})
    wiredCricketers({error, data}){
        if(error){
            console.error(error);
        }else if(data){
            this.cricketersData = data;
            console.log('this.cricketerData: '+JSON.stringify(this.cricketersData))
        }
    }
    @wire(MessageContext)
    messageContext;
    handleClickPlayerCard(event){
        this.selecterPlayerId = event.currentTarget.dataset.id;
        this.selecterplayerName = event.currentTarget.dataset.name;
        console.log('this.selecterPlayerId: '+JSON.stringify(this.selecterPlayerId))
        console.log('Player Name: ' + JSON.stringify(this.selecterplayerName));
        let boxclass = this.template.querySelectorAll('.selected');
        if(boxclass.length > 0){
            this.removeClass();
        }
        publish(this.messageContext, SELECTED_PLAYER_CHANEL, {cricketerId : this.selecterPlayerId});
        let playerBox = this.template.querySelector(`[data-id="${this.selecterPlayerId}"]`);
        if(playerBox){
            playerBox.className = 'title_wrapper selected'
        }
        this.dispatchEvent(new CustomEvent('select',{
            detail:{
                playerId : this.selecterPlayerId,
                playerName: this.selecterplayerName
            }
        }))
    }
    removeClass(){
        this.template.querySelectorAll('.selected')[0].classList.remove('selected');
    }
    @api searchCricketer(nationalityOfCricketer){
        console.log('Value in child lwc : '+JSON.stringify(nationalityOfCricketer))
        this.cricketersNationality = nationalityOfCricketer;
    }
}