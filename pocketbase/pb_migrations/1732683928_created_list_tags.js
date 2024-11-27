/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "list_tags_table",
    "created": "2024-11-27 05:05:28.009Z",
    "updated": "2024-11-27 05:05:28.009Z",
    "name": "list_tags",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "list_tags_list_id",
        "name": "list",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "lists_table",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "title"
          ]
        }
      },
      {
        "system": false,
        "id": "list_tags_name",
        "name": "tag",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 50,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("list_tags_table");

  return dao.deleteCollection(collection);
})
