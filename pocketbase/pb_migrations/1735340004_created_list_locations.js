/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "esm26wbvcx1n10c",
    "created": "2024-12-27 22:53:24.518Z",
    "updated": "2024-12-27 22:53:24.518Z",
    "name": "list_locations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "a5uvuj2v",
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
      },
      {
        "system": false,
        "id": "jxd7ouoh",
        "name": "center_lat",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "s7lvh5tj",
        "name": "center_lng",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("esm26wbvcx1n10c");

  return dao.deleteCollection(collection);
})
