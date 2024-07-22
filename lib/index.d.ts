import type { Options as NormalizeUrlOptions } from 'normalize-url'
import { Match } from 'super-regex'
export interface Options extends NormalizeUrlOptions {
  /**
     * 提取出出现在找到的URL中的查询参数中的URL
     * @default false
     */
  readonly extractFromQueryString?: boolean
  /**
     * 排除与给定数组中的URL匹配的URL
     * @default []
     */
  readonly exclude?: string[]
  /**
     * 要求URL具有方案或以`www.`开头才被视为URL
     * 当为`false`时，会匹配有效顶级域名的列表，因此会匹配像`unicorn.education`这样的URL
     * 如果使用`extractFromQueryString`选项，则不会影响查询参数中的URL
     * @default false
     */
  readonly requireSchemeOrWww?: boolean
  /**
     * 返回的URL是否标准化处理
     * @default true
     */
  readonly normalize?: boolean
}
/**
 * @class GetUrls - 获取文本中的URL
 */
export default class GetUrls {
  /**
     * 处理www对应的参数
     * @param strict - 是否严格处理
     */
  static requireSchemeOrWww (strict: boolean): {
    re2: boolean
    strict: boolean
    parens: boolean
  } | undefined
  /**
     * 从给定的URL数组中排除与排除数组中正则表达式匹配的URL
     * @param urls - 需要过滤的URL数组
     * @param exclude - 包含正则表达式字符串的数组，用于匹配需要排除的URL
     * @returns 过滤后的URL数组，不包含任何与排除数组中正则表达式匹配的URL
     */
  static exclude (urls: string[], exclude: string[] | RegExp[]): string[]
  /**
     * 对URL进行规范化处理
     * @param url - URL
     * @param options - 选项
     * @returns 规范化处理后的URL
     */
  static normalize (url: string, options: Options): string
  /**
     * 从查询参数中获取URL
     * @param url - URL
     */
  static getUrlsFromQueryParameters (url: string): Set<string>
  /**
     * 对URL结果进行规范化处理
     * @param urls - URL结果
     * @param options - 选项
     */
  static normalizeUrls (urls: Iterable<Match>, options: Options): string[]
  /**
     * 对URL结果进行正常化处理
     * @param urls - URL结果
     * @param extractFromQueryString - 提取出出现在找到的URL中的查询参数中的URL
     */
  static normalizeUrls2 (urls: Iterable<Match>, extractFromQueryString?: boolean): string[]
  /**
     * 读取文本中的URL 返回数组
     * @param text 文本
     * @param options 选项
     * @returns
     */
  static getUrls (text: string, options?: Options): string[]
}
