/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const dotenv = require('dotenv');
const pgtools = require('pgtools');

var dbm;
var type;
var seed;

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT
} = process.env;

const config = {
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT
};

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  pgtools.createdb(config, 'storefront_test', function(err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  });
  return null;
};

exports.down = function(db) {
  pgtools.dropdb(config, 'storefront_test', function(err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  });
  return null;
};

exports._meta = {
  version: 1
};
