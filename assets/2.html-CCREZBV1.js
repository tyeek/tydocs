import{_ as s,c as a,a as p,o as t}from"./app-CEvnTgAb.js";const e={};function o(l,n){return t(),a("div",null,n[0]||(n[0]=[p(`<h1 id="金融数据清洗那些坑-我的数据处理经验与避坑指南" tabindex="-1"><a class="header-anchor" href="#金融数据清洗那些坑-我的数据处理经验与避坑指南"><span>金融数据清洗那些坑：我的数据处理经验与避坑指南</span></a></h1><hr><h2 id="一、金融数据清洗的特殊性" tabindex="-1"><a class="header-anchor" href="#一、金融数据清洗的特殊性"><span>一、金融数据清洗的特殊性</span></a></h2><p>金融数据具有<strong>高噪声、强时序性、幸存者偏差</strong>三大特征。我曾处理过某私募基金的股票因子数据，原始数据中竟存在<strong>停牌期间异常交易记录</strong>（因数据源接口BUG导致），直接导致回测收益率虚高12%。以下是关键处理流程与代码实现。</p><hr><h2 id="二、数据获取与初步处理" tabindex="-1"><a class="header-anchor" href="#二、数据获取与初步处理"><span>二、数据获取与初步处理</span></a></h2><h3 id="_1-数据获取-以股票数据为例" tabindex="-1"><a class="header-anchor" href="#_1-数据获取-以股票数据为例"><span>1. 数据获取（以股票数据为例）</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd</span>
<span class="line"><span class="token keyword">import</span> akshare <span class="token keyword">as</span> ak</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取A股日线数据（含复权因子）</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">get_stock_data</span><span class="token punctuation">(</span>code<span class="token punctuation">,</span> start_date<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    df <span class="token operator">=</span> ak<span class="token punctuation">.</span>stock_zh_a_hist<span class="token punctuation">(</span>symbol<span class="token operator">=</span>code<span class="token punctuation">,</span> adjust<span class="token operator">=</span><span class="token string">&quot;hfq&quot;</span><span class="token punctuation">,</span> start_date<span class="token operator">=</span>start_date<span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment"># 处理东方财富接口的异常日期格式</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;日期&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> pd<span class="token punctuation">.</span>to_datetime<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;日期&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> errors<span class="token operator">=</span><span class="token string">&#39;coerce&#39;</span><span class="token punctuation">)</span> </span>
<span class="line">    df <span class="token operator">=</span> df<span class="token punctuation">.</span>dropna<span class="token punctuation">(</span>subset<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;日期&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span>set_index<span class="token punctuation">(</span><span class="token string">&#39;日期&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> df</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 示例：获取贵州茅台数据</span></span>
<span class="line">df <span class="token operator">=</span> get_stock_data<span class="token punctuation">(</span><span class="token string">&quot;600519&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;20200101&quot;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>必须使用<strong>复权数据</strong>（<code>adjust=&quot;hfq&quot;</code>），否则除权缺口会导致收益率计算失真</li><li>部分数据源存在<strong>节假日非停牌零交易</strong>记录，需用<code>df.query(&#39;成交量 &gt; 0&#39;)</code>过滤</li></ul><hr><h2 id="三、六大核心问题处理方案" tabindex="-1"><a class="header-anchor" href="#三、六大核心问题处理方案"><span>三、六大核心问题处理方案</span></a></h2><h3 id="_1-缺失值处理-比普通数据复杂3倍" tabindex="-1"><a class="header-anchor" href="#_1-缺失值处理-比普通数据复杂3倍"><span>1. 缺失值处理（比普通数据复杂3倍！）</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 金融数据缺失的特殊场景：停牌、集合竞价无成交</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">handle_missing</span><span class="token punctuation">(</span>df<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 价格缺失：用前复权价向前填充</span></span>
<span class="line">    price_cols <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;开盘&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;最高&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;最低&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span></span>
<span class="line">    df<span class="token punctuation">[</span>price_cols<span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span>price_cols<span class="token punctuation">]</span><span class="token punctuation">.</span>fillna<span class="token punctuation">(</span>method<span class="token operator">=</span><span class="token string">&#39;ffill&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 成交量缺失：填充0（停牌期间无交易）</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>fillna<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> df</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证：检查停牌期间是否填充正确</span></span>
<span class="line"><span class="token keyword">assert</span> df<span class="token punctuation">.</span>loc<span class="token punctuation">[</span><span class="token string">&#39;2023-02-01&#39;</span><span class="token punctuation">:</span><span class="token string">&#39;2023-02-10&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token string">&quot;停牌期成交量处理错误！&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>不可直接删除停牌日数据，否则回测时会产生<strong>未来信息泄露</strong></li><li>若多只股票数据混合，需按<code>groupby(&#39;代码&#39;).fillna(...)</code>分组处理</li></ul><hr><h3 id="_2-异常值检测-分位数法失效案例" tabindex="-1"><a class="header-anchor" href="#_2-异常值检测-分位数法失效案例"><span>2. 异常值检测（分位数法失效案例）</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">import</span> numpy <span class="token keyword">as</span> np</span>
<span class="line"></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">detect_outliers</span><span class="token punctuation">(</span>s<span class="token punctuation">,</span> n<span class="token operator">=</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token triple-quoted-string string">&quot;&quot;&quot;改进版标准差法，解决涨停板干扰&quot;&quot;&quot;</span></span>
<span class="line">    median <span class="token operator">=</span> np<span class="token punctuation">.</span>median<span class="token punctuation">(</span>s<span class="token punctuation">)</span></span>
<span class="line">    mad <span class="token operator">=</span> np<span class="token punctuation">.</span>median<span class="token punctuation">(</span>np<span class="token punctuation">.</span><span class="token builtin">abs</span><span class="token punctuation">(</span>s <span class="token operator">-</span> median<span class="token punctuation">)</span><span class="token punctuation">)</span>  <span class="token comment"># 中位数绝对偏差</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token operator">~</span><span class="token punctuation">(</span><span class="token punctuation">(</span>s <span class="token operator">&gt;</span> median <span class="token operator">+</span> n<span class="token operator">*</span>mad<span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token punctuation">(</span>s <span class="token operator">&lt;</span> median <span class="token operator">-</span> n<span class="token operator">*</span>mad<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 应用：过滤日收益率异常值</span></span>
<span class="line">daily_return <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>pct_change<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">valid_mask <span class="token operator">=</span> detect_outliers<span class="token punctuation">(</span>daily_return<span class="token punctuation">.</span>dropna<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> n<span class="token operator">=</span><span class="token number">5</span><span class="token punctuation">)</span></span>
<span class="line">clean_df <span class="token operator">=</span> df<span class="token punctuation">[</span>valid_mask<span class="token punctuation">.</span>reindex<span class="token punctuation">(</span>df<span class="token punctuation">.</span>index<span class="token punctuation">,</span> fill_value<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>传统分位数法会将<strong>连续涨停</strong>误判为异常值，需结合<strong>业务规则</strong>调整阈值</li><li>科创板/创业板需动态调整涨跌幅阈值（20%→10%的历史数据）</li></ul><hr><h3 id="_3-重复数据-暗藏玄机" tabindex="-1"><a class="header-anchor" href="#_3-重复数据-暗藏玄机"><span>3. 重复数据（暗藏玄机）</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 识别真正需要去重的场景</span></span>
<span class="line">duplicate_mask <span class="token operator">=</span> df<span class="token punctuation">.</span>duplicated<span class="token punctuation">(</span>subset<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;代码&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;日期&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> keep<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">if</span> duplicate_mask<span class="token punctuation">.</span><span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 优先保留收盘价最接近成交均价的记录</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;价差&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span> <span class="token operator">-</span> df<span class="token punctuation">[</span><span class="token string">&#39;成交均价&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">abs</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    df <span class="token operator">=</span> df<span class="token punctuation">.</span>sort_values<span class="token punctuation">(</span><span class="token string">&#39;价差&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>drop_duplicates<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;代码&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;日期&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> keep<span class="token operator">=</span><span class="token string">&#39;first&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>同一标的同日数据可能来自<strong>不同交易所</strong>（如AH股），不可直接去重</li><li>做市商报价产生的重复数据可能包含<strong>隐藏流动性信息</strong>，需谨慎处理</li></ul><hr><h3 id="_4-涨跌停特殊处理" tabindex="-1"><a class="header-anchor" href="#_4-涨跌停特殊处理"><span>4. 涨跌停特殊处理</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">def</span> <span class="token function">handle_limit_up_down</span><span class="token punctuation">(</span>df<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment"># 识别涨停（close=high且收益率&gt;=9.7%）</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;is_limit_up&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span> <span class="token operator">==</span> df<span class="token punctuation">[</span><span class="token string">&#39;最高&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>pct_change<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token number">0.097</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token comment"># 涨停日特征：用次日开盘价修正流动性偏差</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;修正收盘价&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> np<span class="token punctuation">.</span>where<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;is_limit_up&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;开盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> df</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>涨停次日往往存在<strong>流动性折价</strong>，需在因子计算中特殊处理</li><li>新股上市首周数据需单独提取（<code>df[df[&#39;上市日期&#39;] &gt; df.index.min()]</code>）</li></ul><hr><h3 id="_5-特征工程陷阱" tabindex="-1"><a class="header-anchor" href="#_5-特征工程陷阱"><span>5. 特征工程陷阱</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">from</span> talib <span class="token keyword">import</span> RSI<span class="token punctuation">,</span> BBANDS</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算技术指标（典型错误示范）</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;rsi&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> RSI<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>           <span class="token comment"># 错误！未处理停牌期</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;upper&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> _<span class="token punctuation">,</span> _ <span class="token operator">=</span> BBANDS<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment"># 错误！窗口包含未来数据</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 正确做法：滚动窗口计算</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;rsi&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">.</span>groupby<span class="token punctuation">(</span><span class="token string">&#39;代码&#39;</span><span class="token punctuation">,</span> group_keys<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token string">&#39;收盘&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token builtin">apply</span><span class="token punctuation">(</span></span>
<span class="line">    <span class="token keyword">lambda</span> x<span class="token punctuation">:</span> x<span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">14</span><span class="token punctuation">,</span> min_periods<span class="token operator">=</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">apply</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> x<span class="token punctuation">:</span> RSI<span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>所有滚动计算必须使用<code>groupby+rolling</code>，防止<strong>标的间数据污染</strong></li><li>特征存储需带<strong>计算日期标记</strong>，避免回测时用到未来数据</li></ul><hr><h3 id="_6-数据存储规范" tabindex="-1"><a class="header-anchor" href="#_6-数据存储规范"><span>6. 数据存储规范</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 最佳存储格式（Parquet + 分区）</span></span>
<span class="line">df<span class="token punctuation">.</span>to_parquet<span class="token punctuation">(</span></span>
<span class="line">    path<span class="token operator">=</span><span class="token string">&#39;stock_data/&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    partition_cols<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;date_part=YYYYMM&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>  <span class="token comment"># 按年月分区</span></span>
<span class="line">    schema_version<span class="token operator">=</span><span class="token string">&#39;v1.2&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    metadata<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">&#39;author&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;Your Name&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;source&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;AKShare&#39;</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>避坑点</strong>：</p><ul><li>避免使用csv格式（无法保存<strong>数据类型</strong>和<strong>缺失值标记</strong>）</li><li>添加数据版本控制，防止因子计算混乱</li></ul><hr><h2 id="四、工具链推荐-亲测避坑" tabindex="-1"><a class="header-anchor" href="#四、工具链推荐-亲测避坑"><span>四、工具链推荐（亲测避坑）</span></a></h2><ol><li><strong>数据获取</strong>：AKShare（免费） &gt; WindPy（付费但稳定）</li><li><strong>清洗工具</strong>：Pandas（灵活） &gt; FineDataLink（适合非编程用户）</li><li><strong>特征计算</strong>：TA-Lib（C++加速） &gt; 自行实现（易出错）</li><li><strong>存储方案</strong>：Apache Parquet（列存储） &gt; HDF5（单机专用）</li></ol><hr><h2 id="五、实战案例-基金净值数据清洗" tabindex="-1"><a class="header-anchor" href="#五、实战案例-基金净值数据清洗"><span>五、实战案例：基金净值数据清洗</span></a></h2><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 处理某私募基金净值数据</span></span>
<span class="line">raw_df <span class="token operator">=</span> pd<span class="token punctuation">.</span>read_excel<span class="token punctuation">(</span><span class="token string">&quot;fund_data.xlsx&quot;</span><span class="token punctuation">,</span> skiprows<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">,</span> parse_dates<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;估值日期&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">clean_df <span class="token operator">=</span> <span class="token punctuation">(</span></span>
<span class="line">    raw_df</span>
<span class="line">    <span class="token punctuation">.</span>rename<span class="token punctuation">(</span>columns<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">&#39;估值日&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;date&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;单位净值&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;nav&#39;</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span>pipe<span class="token punctuation">(</span>handle_missing<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span>pipe<span class="token punctuation">(</span>handle_limit_up_down<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span>query<span class="token punctuation">(</span><span class="token string">&quot;nav &gt; 0&quot;</span><span class="token punctuation">)</span>  <span class="token comment"># 剔除清算期异常值</span></span>
<span class="line">    <span class="token punctuation">.</span>sort_values<span class="token punctuation">(</span><span class="token string">&#39;date&#39;</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line">clean_df<span class="token punctuation">.</span>to_feather<span class="token punctuation">(</span><span class="token string">&quot;cleaned_fund_data.feather&quot;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>成果</strong>：成功修复因数据错误导致的<strong>年化波动率计算偏差</strong>（从38%降至22%）</p><hr><blockquote><p><strong>数据清洗箴言</strong>：金融数据清洗不是简单的ETL，而是对市场微观结构的深度理解。每一条异常数据背后，都可能隐藏着套利机会或风险信号。</p></blockquote>`,50)]))}const i=s(e,[["render",o]]),u=JSON.parse('{"path":"/tech/fml/2.html","title":"金融数据清洗那些坑：我的数据处理经验与避坑指南","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"一、金融数据清洗的特殊性","slug":"一、金融数据清洗的特殊性","link":"#一、金融数据清洗的特殊性","children":[]},{"level":2,"title":"二、数据获取与初步处理","slug":"二、数据获取与初步处理","link":"#二、数据获取与初步处理","children":[{"level":3,"title":"1. 数据获取（以股票数据为例）","slug":"_1-数据获取-以股票数据为例","link":"#_1-数据获取-以股票数据为例","children":[]}]},{"level":2,"title":"三、六大核心问题处理方案","slug":"三、六大核心问题处理方案","link":"#三、六大核心问题处理方案","children":[{"level":3,"title":"1. 缺失值处理（比普通数据复杂3倍！）","slug":"_1-缺失值处理-比普通数据复杂3倍","link":"#_1-缺失值处理-比普通数据复杂3倍","children":[]},{"level":3,"title":"2. 异常值检测（分位数法失效案例）","slug":"_2-异常值检测-分位数法失效案例","link":"#_2-异常值检测-分位数法失效案例","children":[]},{"level":3,"title":"3. 重复数据（暗藏玄机）","slug":"_3-重复数据-暗藏玄机","link":"#_3-重复数据-暗藏玄机","children":[]},{"level":3,"title":"4. 涨跌停特殊处理","slug":"_4-涨跌停特殊处理","link":"#_4-涨跌停特殊处理","children":[]},{"level":3,"title":"5. 特征工程陷阱","slug":"_5-特征工程陷阱","link":"#_5-特征工程陷阱","children":[]},{"level":3,"title":"6. 数据存储规范","slug":"_6-数据存储规范","link":"#_6-数据存储规范","children":[]}]},{"level":2,"title":"四、工具链推荐（亲测避坑）","slug":"四、工具链推荐-亲测避坑","link":"#四、工具链推荐-亲测避坑","children":[]},{"level":2,"title":"五、实战案例：基金净值数据清洗","slug":"五、实战案例-基金净值数据清洗","link":"#五、实战案例-基金净值数据清洗","children":[]}],"git":{},"filePathRelative":"tech/fml/2.md"}');export{i as comp,u as data};
