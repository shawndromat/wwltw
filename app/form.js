import {escapeHtml} from './index';
import {Item} from './item';

export class Form {
    constructor(formSelector, previewSelector) {
        this.$elem = $(formSelector);
        this.$teamName = this.$elem.find('#teamName');
        this.$previewElem = $(previewSelector);
        this.items = [];
        this.generateItems();

        $('.ui.fluid.dropdown').dropdown();

        this.$elem.on('input', 'input', () => {
            this.displayPreview()
        });
        this.$elem.on('keyup', 'textarea', () => {
            this.displayPreview()
        });
        this.$elem.on('change', 'input', () => {
            this.displayPreview()
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
        window.open(this.generateGoogleGroupUrl(), "_blank" )

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].openPivotalkEmails()
        }
    }

    getTeamName() {
        return escapeHtml(this.$teamName.val())
    }

    getSubject() {
        return `${this.getTeamName()}`
    }

    getSignature() {
        let teamName = this.getTeamName()
        return teamName ? `- ${teamName}` : ""
    }

    getItems() {
        return this.items.map((item) => {
            return item.formattedContent();
        }).join("")
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
      <table>
        <tbody>
          <tr>
            <td class="col-xs-3">To:</td>
            <td class="col-xs-9">wwltw@pivotal.io</td>
          </tr>
          <tr>
            <td class="col-xs-3">Subject:</td>
            <td class="col-xs-9">${this.getSubject()}</td>
          </tr>
          <tr>
            <td class="col-xs-3">Body:</td>
            <td class="col-xs-9">
              <ol>
                ${this.getItems()}
              </ol>
              <p>${this.getSignature()}</p>
            </td>
          </tr>
        </tbody>
      </table>
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