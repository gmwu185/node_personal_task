module.exports = {
  doc_getPost: () => {
    /** #swagger.summary = '取得單一貼文',
    #swagger.description = `取得單一貼文
      <ul>
        <li>網址路由以 <code>:id</code> 傳入參數，直接針對 Posts 中的 document id 進行取得資料。</li>
      </ul>
    `,
    * #swagger.tags = ['動態貼文']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
    },
    #swagger.responses[200] = {
      description: `取得單筆貼文`,
      schema: {
        "status": true,
        "data": {
          "_id": "629a2c258329aaee5f70d63e",
          "userData": {
            "_id": "629a24a903a87b6101044846",
            "userName": "newPatchUserName",
            "email": "gg@mail.com",
            "createAt": "2022-06-03T15:11:37.281Z"
          },
          "content": "03_test",
          "tags": [
            "感情2"
          ],
          "type": "person",
          "image": "http://",
          "likes": [
            {
              "_id": "629a21143742640bf2686ece",
              "userName": "小明-sign_up"
            }
          ],
          "comments": [],
          "id": "629a2c258329aaee5f70d63e"
        }
      }
    }
   */
    next();
  },
  getPost2: () => {},
};
