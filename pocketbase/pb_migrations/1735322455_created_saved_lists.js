/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "u9faetevylf7r8c",
    "created": "2024-12-27 18:00:55.108Z",
    "updated": "2024-12-27 18:00:55.108Z",
    "name": "saved_lists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ojopxl5h",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "yx4e8gkd",
        "name": "list",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "5iaqdk8ccqd45xr",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && (@request.auth.id = user.id || @request.auth.id = list.user)",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id = user.id || @request.auth.id = list.user)",
    "createRule": "@request.auth.id != \"\" && @request.auth.id != list.user",
    "updateRule": null,
    "deleteRule": "@request.auth.id = user.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("u9faetevylf7r8c");

  return dao.deleteCollection(collection);
})
