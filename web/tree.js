    
    // define the item component
    Vue.component('item', {
        template: '#item-template',
        props: {
            model: Object,
            editing: Object
        },
        data: function () {
            return {
                open: false
            }
        },
        computed: {
            isFolder: function () {
                return this.model.type === 'dir'
            },
            emptyFolder: function () {
                return this.model.type === 'dir' && !this.model.children
            }
        },
        methods: {
            upSelectEvent: function (model) {
                this.$emit('select', model)
            },
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open
                } 
                this.$emit('select', this.model)
            }
        }
    })