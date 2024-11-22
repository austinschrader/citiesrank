/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4p9o81cfqrmoah0");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "4p9o81cfqrmoah0",
    "created": "2024-11-19 23:42:09.168Z",
    "updated": "2024-11-20 08:24:01.332Z",
    "name": "cities2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hjdw7bdr",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
