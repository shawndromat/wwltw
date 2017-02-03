import {escapeHtml} from './index';
import {tagList} from './tagList';

export class Item {
    constructor(id) {
        this.validContent = true
        this.validTags = true
        this.$elem = $(this.generateItem(id))
        this.$contentGroup = this.$elem.find('.form-group.content')
        this.$tagGroup = this.$elem.find('.form-group.tags')
    }

    findTags(tagList) {
        return $.map(tagList, (tag) => {
            return $(tag).val()
        })
    }

    getTags() {
        return this.findTags(this.$elem.find('option:selected'))
    }

    getContent() {
        return escapeHtml(this.$elem.find('textarea').val())
    }

    getActions() {
        let checkedActions = this.$elem.find('.actions input:checked')
        return $.map(checkedActions, (input) => {
            return input.value
        })
    }

    isEmpty() {
        return this.getContent() == '' && this.getTags().length == 0
    }

    isValid() {
        if (this.isEmpty()) { return true }

        this.validContent = this.getContent() != ''

        if (this.validContent) {
            this.$contentGroup.removeClass('error')
            this.$contentGroup.find('span').empty()
        } else {
            this.$contentGroup.addClass('error')
            this.$contentGroup.find('span').text('Content cannot be empty')
        }

        this.validTags = this.getTags().length > 0

        if (this.validTags) {
            this.$tagGroup.removeClass('error')
            this.$tagGroup.find('span').empty()
        } else {
            this.$tagGroup.addClass('error')
            this.$tagGroup.find('span').text('At least one tag required')
        }

        return this.validContent && this.validTags
    }

    formattedTags() {
        let tags = this.getTags();
        return (tags.length > 0) ? `Tags: ${tags.join(', ')}` : ''
    }

    formattedContent() {
        let content = this.getContent();

        if (content !== "") {
            return `<li>
                    ${content} <br/>
                    ${this.formattedTags()}
                </li>`
        } else {
            return ""
        }
    }

    emailBodyContent() {
        let tags = this.formattedTags();
        let content = this.getContent();
        if (content !== "" && tags !== "") {
            return `${content}\n${tags}\n\n`
        } else {
            return ""
        }
    }

    populateTags() {
        let tagHtml = '';
        tagList.map((tag) => {
            tagHtml += `<option value="${tag}">${tag}</option>`
        });

        return tagHtml;
    }

    generatePivotalkUrl() {
        let emailRecipent = encodeURIComponent('pivotalk+wwltw@gmail.com');
        let emailSubject = encodeURIComponent('WWLTW to Pivotalk');
        let emailBody = encodeURIComponent(this.emailBodyContent());
        return `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${emailRecipent}&su=${emailSubject}&body=${emailBody}`
    }

    openPivotalkEmails() {
        if(this.getContent() !== ""
            && this.getTags().length > 0
            && this.getActions().indexOf('send-to-pivotalk') !== -1) {
            window.open(this.generatePivotalkUrl(), "_blank" )
        }

    }

    generateItem(id) {
        return `
                <div data-item-id=${id} class="ui segment">
                    <div class="form-group content">
                        <h3 for=${"item-" + id}>Item ${id}</h3>
                        <textarea name=${"item-" + id} id=${"item-" + id} cols="30" rows="3" class="form-control"></textarea>
                        <span></span>
                    </div>
                    <div class="form-group tags">
                      <div class="checkbox">
                          <h4>Tags</h4>
                          <select name="tags" multiple="" class="ui fluid search dropdown">
                              <option value="">Tags</option>
                              ${this.populateTags()}
                          </select>
                      </div>
                      <span></span>
                    </div>
                    <div class="form-group actions">
                      <div class="checkbox">
                        <h4>Actions</h4>
                        <label><input type="checkbox" name="action" value="send-to-pivotalk"> Send to Pivotalk</label>
                      </div>
                    </div>
                </div>
            `
    }
}
