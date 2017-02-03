import {escapeHtml} from './index';
import {Item} from './item';

export class Form {
    constructor(formSelector, previewSelector) {
        this.$elem = $(formSelector);
        this.$teamName = this.$elem.find('#teamName');
        this.$previewElem = $(previewSelector);
        this.items = [];
        this.errors = [];
        this.generateItems();
        $('.ui.fluid.dropdown').dropdown();

        this.$elem.on('input', 'input', () => {
            this.displayPreview()
        });
        this.$elem.on('keyup', 'textarea', () => {
            this.displayPreview()
        });
        this.$elem.on('change', '.ui.fluid.dropdown', () => {
            this.displayPreview()
        });

        this.$elem.on('submit', (e) => {
            this.onSubmit(e)
        });

        this.displayPreview()
    }

    findTags(tagList) {
        return tagList.map((index, tag) => {
            return $(tag).val()
        })
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.validate()) {
            window.open(this.generateGoogleGroupUrl(), "_blank" );

            for (var i = 0; i < this.items.length; i++) {
                this.items[i].openPivotalkEmails()
            }
        } else {
            this.displayPreview()
            this.errors.map((error) => {
                let $li = $(`<li>${error}</li>`)
                this.$elem.find('.form-errors').addClass('error')
                this.$elem.find('.form-errors').append($li)
            })
        }
    }

    getTeamName() {
        return escapeHtml(this.$teamName.val())
    }

    getSubject() {
        return `${this.getTeamName()}`
    }

    getSignature() {
        let teamName = this.getTeamName();
        return teamName ? `- ${teamName}` : ""
    }

    getItems() {
        return this.items.map((item) => {
            return item.formattedContent();
        }).join("")
    }

    validate() {
        this.errors = []
        this.$elem.find('.form-errors').removeClass('error')
        this.$elem.find('.form-errors').empty();

        this.itemsValid()
        this.atLeastOneItem()
        this.hasTeamName()

        return this.errors.length === 0
    }

    invalidItems() {
        return this.items.filter((item) => {
            return !item.isValid()
        })
    }

    itemsValid(){
        let itemsAreValid = this.invalidItems().length === 0;
        if(!itemsAreValid){
            this.errors.push('Item must have content and tag')
        }
        return itemsAreValid
    }

    atLeastOneItem() {
        let atLeastOneItem = this.items.filter((item) => {
            return !item.isEmpty()
        }).length > 0;

        if(!atLeastOneItem){
            this.errors.push('There must be atleast one item')
            $('#item-wrapper').addClass('error')
        } else {
            $('#item-wrapper').removeClass('error')
        }
        return atLeastOneItem;
    }

    hasTeamName() {
        if(this.getTeamName() == ''){
            this.errors.push('Team name should not be empty');
            $('.team-name-group').addClass('error');
            return false;
        }
        $('.team-name-group').removeClass('error');
        return true;
    }

    generateGoogleGroupUrl(){
        let emailRecipent = encodeURIComponent('wwltw-beach-hackathon@googlegroups.com');
        let emailSubject = encodeURIComponent(this.getSubject());
        let emailItems = this.items.map((item) => {
            return item.emailBodyContent()
        }).join("");
        let emailBody = encodeURIComponent(emailItems);
        return `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${emailRecipent}&su=${emailSubject}&body=${emailBody}`
    }

    generatePreview() {
        return `
        <div class="row">
          <div class="col-md-3">To:</div>
          <div class="col-md-9">wwltw@pivotal.io</div>
        </div>
        <div class="row">
          <div class="col-md-3">Subject:</div>
          <div class="col-md-9">${this.getSubject()}</div>
        </div>
        <div class="row">
          <div class="col-md-3">Body:</div>
          <div class="col-md-9">
            <ol>
              ${this.getItems()}
            </ol>
            <p>${this.getSignature()}</p>
          </div>
        </div>
      `
    }

    displayPreview() {
        this.$previewElem.html(this.generatePreview())
    }

    generateItems() {
        for (let i = 1; i < 4; i++) {
            let item = new Item(i);
            this.items.push(item);
            this.$elem.find('#item-wrapper').append(item.$elem);
        }
    }
}
