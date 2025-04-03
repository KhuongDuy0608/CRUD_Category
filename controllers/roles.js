const menuModel = require('../schemas/menu'); 

module.exports = {
    GetAllMenus: async function() {
        try {
            return await menuModel.find({ isDeleted: false });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    CreateAMenu: async function(text, url, parentId) {
        try {
            let newMenu = new menuModel({
                text: text,
                url: url,
                parent: parentId || null 
            });
            return await newMenu.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
