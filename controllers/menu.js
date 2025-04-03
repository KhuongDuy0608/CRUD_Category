let menuModel = require('../schemas/menu'); 

module.exports = {

    GetAllMenu: async function () {
        try {
            let menuList = await menuModel.find({ isDeleted: false });

            let menuMap = {};
            menuList.forEach(menu => {
                menuMap[menu._id] = {
                    text: menu.text,
                    url: menu.url,
                    children: []
                };
            });

            let rootMenus = [];
            menuList.forEach(menu => {
                if (menu.parent) {
                    if (menuMap[menu.parent]) {
                        menuMap[menu.parent].children.push(menuMap[menu._id]);
                    }
                } else {
                    rootMenus.push(menuMap[menu._id]);
                }
            });

            return rootMenus; 
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
