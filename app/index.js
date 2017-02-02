class Item {
    constructor(id) {
        this.$elem = $(this.generateItem(id))
    }

    findTags(tagList) {
        return $.map(tagList, (tag) => {
            return $(tag).val()
        })
    }

    formattedContent() {
        let content = this.$elem.find('textarea').val();
        let tags = this.findTags(this.$elem.find('input:checked'));
        if(content !== "" && tags.length != 0) {
            return `<li>
                    ${content} <br/>
                    Tags: ${tags.join(', ')}
                </li>
                <br/>`
        }
    }

    emailBodyContent() {
        let tags = this.findTags(this.$elem.find('input:checked')).join(', ');
        return (this.$elem.find('textarea').val() + '\n' + 'Tags: ' + tags + '\n');
    }

    populateTags() {
        var tagList = ['ruby', 'js'];
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
                        <select name="tags" multiple="" class="ui fluid dropdown">
                            <option value="">Tags</option>
                            ${this.populateTags()}
                        </select>
                    </div>
                </div>
            `
        // <label for=${"item-" + id + "java"}><input type="checkbox" id=${"item-" + id + "java"} value="java" />Java</label>
        // <label for=${"item-" + id + "ruby"}><input type="checkbox" id=${"item-" + id + "ruby"} value="ruby" />Ruby</label>
        // <label for=${"item-" + id + "discussion"}><input type="checkbox" id=${"item-" + id + "discussion"} value="discussion" />Discussion</label>
    }


}

class Form {
    constructor(selector) {
        this.$elem = $(selector);
        this.$teamName = this.$elem.find('#team-name');
        this.$elem.on('submit', (e) => {
            this.onSubmit(e)
        });
        this.items = [];
        this.generateItems();
    }

    findTags(tagList) {
        return tagList.map((index, tag) => {
            return $(tag).val()
        })
    }

    onSubmit(e) {
        e.preventDefault();
        let teamName = this.$teamName.val();
        let emailContent = '';

        let formattedEmail = `
        <div class="well">
            <div class="row">
                <div class="col-md-6 col-md-offset-3 ">
                    <p>Subject: ${teamName}</p>
                    <p>To: wwltw@pivotal.io</p>
                    <p>Body:</p>
                    <ol>      
        `;

        this.items.map((item) => {
            if(item.formattedContent()){
                formattedEmail += item.formattedContent();
                emailContent += item.emailBodyContent();
            }
        });

        var emailRecipent = encodeURIComponent('pivotalk+wwltw@gmail.com')
        var emailSubject = encodeURIComponent(`WWLTW ${teamName}`);
        var emailBody = encodeURIComponent(emailContent);

        formattedEmail +=
            `
                    </ol>
                    <p>-${teamName} team</p>
                </div>
            </div>
            <a class="btn btn-primary" target="_blank" href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${emailRecipent}&su=${emailSubject}&body=${emailBody}">Send</a>
            </div>
            `

        $('.formatted-email').empty().append(formattedEmail);
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
    new Form('form');
     $('.ui.fluid.dropdown').dropdown();
});

