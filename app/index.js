import $ from 'jquery';

class Form {
    constructor(selector) {
        this.$elem = $(selector);
        this.$teamName = this.$elem.find('#team-name');
        this.$elem.on('submit', (e) => {
            this.onSubmit(e)
        })

        this.generateItems();
    }

    onSubmit(e) {
        e.preventDefault();
        let teamName = this.$teamName.val();
        let formattedEmail = `
            <p>Subject: [WWLTW] ${teamName}</p>
            <p>To: wwltw@pivotal.io</p>
        `;
        $('body').append(formattedEmail);
    }

    generateItems() {
        for(let i = 1; i < 4; i++) {
            this.$elem.find('#item-wrapper').append(this.generateItem(i));
        }
    }

    generateItem(id) {
        return `
            <div data-item-id=${id}>
                <label for=${"item-" + id}>Item ${id}</label>
                <textarea name=${"item-" + id} id=${"item-" + id} cols="30" rows="10"></textarea>
                <h3>Tags</h3>
                <label for=${"item-" + id + "java"}><input type="checkbox" id=${"item-" + id + "java"} name="java" />Java</label>
            </div>
        `
    }
}

$(() => {
    new Form('form');
});

