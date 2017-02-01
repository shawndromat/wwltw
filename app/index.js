import $ from 'jquery';

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

    generateItem(id) {
        return `
        
                <div data-item-id=${id}>
                    <div class="form-group">
                        <label for=${"item-" + id}>Item ${id}</label>
                        <textarea name=${"item-" + id} id=${"item-" + id} cols="30" rows="5" class="form-control"></textarea>
                    </div>
                    <div class="checkbox">
                        <h3>Tags</h3>
                        <label for=${"item-" + id + "java"}><input type="checkbox" id=${"item-" + id + "java"} value="java" />Java</label>
                        <label for=${"item-" + id + "ruby"}><input type="checkbox" id=${"item-" + id + "ruby"} value="ruby" />Ruby</label>
                    </div>
                </div>
            `
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
            }
        });

        formattedEmail +=
            `
                    </ol>
                    <p>-${teamName} team</p>
                </div>
            </div>
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
});

