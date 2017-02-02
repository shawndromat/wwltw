import {tagList} from './tagList';

let escapeHtml = (text) => {
  return text.replace(/[\"&<>]/g, (a) => {
    return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
  });
};

class Item {
    constructor(id) {
        this.$elem = $(this.generateItem(id))
    }

    findTags(tagList) {
        return $.map(tagList, (tag) => {
            return $(tag).data().value
        })
    }

    getTags() {
      return this.findTags(this.$elem.find('input:checked'))
    }

    formattedTags() {
      let tags = this.getTags();
      return (tags.length > 0) ? `Tags: ${tags.join(', ')}` : ''
    }

    formattedContent() {
        let content = escapeHtml(this.$elem.find('textarea').val());

        if(content !== "") {
            return `<li>
                    ${content} <br/>
                    ${this.formattedTags()}
                </li>`
        } else {
          return ""
        }
    }

    emailBodyContent() {
        let tags = this.findTags(this.$elem.find('input:checked')).join(', ');
        return (this.$elem.find('textarea').val() + '\n' + 'Tags: ' + tags + '\n');
    }

    populateTags() {
        let tagHtml = '';
        tagList.map((tag) => {
           tagHtml += `<option value="${tag}">${tag}</option>`
        });

        return tagHtml;
    }

    generateItem(id) {
        return `

                <div data-item-id=${id}>
                    <div class="form-group">
                        <h3 for=${"item-" + id}>Item ${id}</h3>
                        <textarea name=${"item-" + id} id=${"item-" + id} cols="30" rows="5" class="form-control"></textarea>
                    </div>
                    <div class="checkbox">
                        <h4>Tags </h4>
                        <select name="tags" multiple="" class="ui fluid search dropdown">
                            <option value="">Tags</option>
                            ${this.populateTags()}
                        </select>
                    </div>
                </div>
            `
    }


}

class Form {
    constructor(formSelector, previewSelector) {
        this.$elem = $(formSelector);
        this.$teamName = this.$elem.find('#team-name');
        this.$previewElem = $(previewSelector);
        this.items = [];
        this.generateItems();
        this.$elem.on('input', 'input', () => {this.displayPreview()})
        this.$elem.on('keyup', 'textarea', () => {this.displayPreview()})
        this.$elem.on('change', 'input', () => {this.displayPreview()})
        this.displayPreview()
    }

    findTags(tagList) {
        return tagList.map((index, tag) => {
            return $(tag).val()
        })
    }

    getTeamName() {
      return escapeHtml(this.$teamName.val())
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

    generatePreview() {
      return  `
      <table>
        <tbody>
          <tr>
            <td class="col-xs-3">To:</td>
            <td class="col-xs-9">wwltw@pivotal.io</td>
          </tr>
          <tr>
            <td class="col-xs-3">Subject:</td>
            <td class="col-xs-9">[WWLTW] ${this.getTeamName()}</td>
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
            this.items.push(item)
            this.$elem.find('#item-wrapper').append(item.$elem);
        }
    }
}

$(() => {
    new Form('form', '#email-preview');
    $('.ui.fluid.dropdown').dropdown();
});
