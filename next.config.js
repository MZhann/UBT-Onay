const { NextConfig } = require('next');

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["untcs-production.up.railway.app"],
  },
};

module.exports = config;
