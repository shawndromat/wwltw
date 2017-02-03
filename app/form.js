import {escapeHtml} from './index';
import {Learning} from './learning';

export class Form {
    constructor(formSelector, previewSelector) {
        this.$elem = $(formSelector);
        this.$teamName = this.$elem.find('#teamName');
        this.$previewElem = $(previewSelector);
        this.learnings = [];
        this.errors = [];
        this.generateLearnings();
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

            for (var i = 0; i < this.learnings.length; i++) {
                this.learnings[i].openPivotalkEmails(this.getTeamName())
            }
        } else {
            this.displayPreview();
            this.errors.map((error) => {
                let $li = $(`<li>${error}</li>`);
                this.$elem.find('.form-errors').addClass('error');
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

    getLearnings() {
        return this.learnings.map((learning) => {
            return learning.formattedContent();
        }).join("")
    }

    validate() {
        this.errors = [];
        this.$elem.find('.form-errors').removeClass('error');
        this.$elem.find('.form-errors').empty();

        this.learningsValid();
        this.atLeastOneLearning();
        this.hasTeamName();

        return this.errors.length === 0
    }

    invalidLearnings() {
        return this.learnings.filter((learning) => {
            return !learning.isValid()
        })
    }

    learningsValid(){
        let learningsAreValid = this.invalidLearnings().length === 0;
        if(!learningsAreValid){
            this.errors.push('Learning must have content and tag')
        }
        return learningsAreValid
    }

    atLeastOneLearning() {
        let atLeastOneLearning = this.learnings.filter((learning) => {
            return !learning.isEmpty()
        }).length > 0;

        if(!atLeastOneLearning){
            this.errors.push('There must be atleast one learning');
            $('#learning-wrapper').addClass('error')
        } else {
            $('#learning-wrapper').removeClass('error')
        }
        return atLeastOneLearning;
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
        let emailRecipent = encodeURIComponent('wwltw@pivotal.io');
        let emailSubject = encodeURIComponent(this.getSubject());
        let emailLearnings = this.learnings.map((learning) => {
            return learning.emailBodyContent()
        }).join("");
        emailLearnings += `\n - ${this.getTeamName()}`;
        let emailBody = encodeURIComponent(emailLearnings);
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
              ${this.getLearnings()}
            </ol>
            <p>${this.getSignature()}</p>
          </div>
        </div>
      `
    }

    displayPreview() {
        this.$previewElem.html(this.generatePreview())
    }

    generateLearnings() {
        for (let i = 1; i < 4; i++) {
            let learning = new Learning(i);
            this.learnings.push(learning);
            this.$elem.find('#learning-wrapper').append(learning.$elem);
        }
    }
}
