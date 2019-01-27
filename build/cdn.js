/**
 * Created by xiaobxia on 2017/11/24.
 */
const qiniu = require('qiniu');
const path = require('path');
//1.创建鉴权对象
const accessKey = 'mE_KVunTNvnBqk70urXj6IPwA7AkF0f7n_ge6ljt';
const secretKey = 'cuRZJGuJ-FaHanoLznTjEypr-_KIRQZHZAkImZlt';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//3.创建配置
const config = new qiniu.conf.Config();
//华东
config.zone = qiniu.zone.Zone_z0;

const scope = 'fund-console';
/**
 * 上传部分设置
 */
//上传token
let uploadOptions = {
  scope: scope,
  expires: 7200
};
let putPolicy = new qiniu.rs.PutPolicy(uploadOptions);
let uploadToken = putPolicy.uploadToken(mac);
//4.上传对象
let formUploader = new qiniu.form_up.FormUploader(config);
let putExtra = new qiniu.form_up.PutExtra();

/**
 * 桶管理部分
 */
const bucketManager = new qiniu.rs.BucketManager(mac, config);


//传文件
module.exports = {
  upload (file, fileName) {
    return new Promise(function (resolve, reject) {
      formUploader.putFile(uploadToken, fileName, file, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          reject(respErr);
          throw respErr;
        }
        if (respInfo.statusCode === 200) {
          console.log(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
        resolve(respBody);
      });
    });
  },
  getCdnFileList() {
    return new Promise(function (resolve, reject) {
      bucketManager.listPrefix(scope, {
        prefix: '',
      }, function (err, respBody, respInfo) {
        if (err) {
          reject(err);
          console.log(err);
          throw err;
        }
        if (respInfo.statusCode === 200) {
          //文件名是key
          resolve(respBody.items);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
      });
    });
  },
  deleteCdnFile(fileKeys) {
    const deleteOperations = fileKeys.map((item) => {
      return qiniu.rs.deleteOp(scope, item);
    });
    return new Promise(function (resolve, reject) {
      bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
        if (err) {
          reject(err);
          console.log(err);
          throw err;
        } else {
          // 200 is success, 298 is part success
          if (parseInt(respInfo.statusCode / 100) === 2) {
            respBody.forEach(function (item) {
              if (item.code === 200) {
                console.log(item.code + "\tsuccess");
              } else {
                console.log(item.code + "\t" + item.data.error);
              }
            });
            resolve();
          } else {
            console.log(respInfo.deleteusCode);
            console.log(respBody);
          }
        }
      });
    });
  }
};
