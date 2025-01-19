/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wmmnhjc7jej7ohx");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "wmmnhjc7jej7ohx",
    "created": "2024-11-20 00:04:19.088Z",
    "updated": "2024-12-23 05:34:03.404Z",
    "name": "countries",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vnqxauqs",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rfek159o",
        "name": "population",
        "type": "number",
        "required": true,
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
        "id": "giewgak0",
        "name": "description",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rdwarkug",
        "name": "isoCode",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": 2,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": "",
    "updateRule": null,
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
