import urlRegex from 'url-regex-safe'
import normalizeUrl from 'normalize-url'
import { isMatch, matches } from 'super-regex'
/**
 * @class GetUrls - 获取文本中的URL
 */
export default class GetUrls {
  /**
     * 处理www对应的参数
     * @param strict - 是否严格处理
     */
  static requireSchemeOrWww (strict) {
    if (strict !== undefined) {
      return { re2: false, strict, parens: true }
    }
    return undefined
  }

  /**
     * 从给定的URL数组中排除与排除数组中正则表达式匹配的URL
     * @param urls - 需要过滤的URL数组
     * @param exclude - 包含正则表达式字符串的数组，用于匹配需要排除的URL
     * @returns 过滤后的URL数组，不包含任何与排除数组中正则表达式匹配的URL
     */
  static exclude (urls, exclude) {
    const result = new Set(urls)
    for (const v of exclude) {
      const regex = v instanceof RegExp ? v : new RegExp(v)
      for (const i of result) {
        /** 符合正则表达式则过滤 */
        if (isMatch(regex, i, { timeout: 500 })) { result.delete(i) }
      }
    }
    /** set转数组 */
    return Array.from(result)
  }

  /**
     * 对URL进行规范化处理
     * @param url - URL
     * @param options - 选项
     * @returns 规范化处理后的URL
     */
  static normalize (url, options) {
    return normalizeUrl(url.trim().replace(/\.+$/, ''), options)
  }

  /**
     * 从查询参数中获取URL
     * @param url - URL
     */
  static getUrlsFromQueryParameters (url) {
    const list = new Set()
    const { searchParams } = (new URL(url.replace(/^(?:\/\/|(?:www\.))/i, 'http://$2')))
    for (const [, value] of searchParams) {
      if (isMatch(urlRegex({ exact: true }), value, { timeout: 500 })) {
        list.add(value)
      }
    }
    return list
  }

  /**
     * 对URL结果进行规范化处理
     * @param urls - URL结果
     * @param options - 选项
     */
  static normalizeUrls (urls, options) {
    const list = new Set()
    /** 辅助函数 规范化处理 */
    const add = (url) => {
      try {
        list.add(normalizeUrl(url.trim().replace(/\.+$/, ''), options))
      } catch { }
    }
    for (const { match: url } of urls) {
      add(url)
      /** 提取出出现在找到的URL中的查询参数中的URL */
      if (options.extractFromQueryString) {
        const urls = this.getUrlsFromQueryParameters(url)
        for (const v of urls) { add(v) }
      }
    }
    return Array.from(list)
  }

  /**
     * 对URL结果进行正常化处理
     * @param urls - URL结果
     * @param extractFromQueryString - 提取出出现在找到的URL中的查询参数中的URL
     */
  static normalizeUrls2 (urls, extractFromQueryString = false) {
    const list = new Set()
    for (const { match: url } of urls) {
      list.add(url.trim().replace(/\.+$/, ''))
      /** 提取出出现在找到的URL中的查询参数中的URL */
      if (extractFromQueryString) {
        const urls = this.getUrlsFromQueryParameters(url)
        for (const v of urls) { list.add(v.trim().replace(/\.+$/, '')) }
      }
    }
    return Array.from(list)
  }

  /**
     * 读取文本中的URL 返回数组
     * @param text 文本
     * @param options 选项
     * @returns
     */
  static getUrls (text, options = {}) {
    /** 获取正则表达式 */
    const regex = urlRegex(this.requireSchemeOrWww(options.requireSchemeOrWww || false))
    /** 使用super-regex库的matches函数匹配URL */
    const results = matches(regex, text, { matchTimeout: 500 })
    /** 标准化 */
    if (options.normalize) {
      const list = this.normalizeUrls(results, options)
      if (!options.exclude) { return list }
      return this.exclude(list, options.exclude)
    }
    /** 正常处理 */
    const list = this.normalizeUrls2(results, options.extractFromQueryString)
    if (!options.exclude) { return list }
    return this.exclude(list, options.exclude)
  }
}
