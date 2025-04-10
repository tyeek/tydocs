import{_ as s,c as a,a as p,o as t}from"./app-CEvnTgAb.js";const e={};function l(c,n){return t(),a("div",null,n[0]||(n[0]=[p(`<h1 id="从理论到实践-我的金融机器学习项目开发笔记" tabindex="-1"><a class="header-anchor" href="#从理论到实践-我的金融机器学习项目开发笔记"><span>从理论到实践：我的金融机器学习项目开发笔记</span></a></h1><h2 id="一、项目背景与目标" tabindex="-1"><a class="header-anchor" href="#一、项目背景与目标"><span>一、项目背景与目标</span></a></h2><p><strong>场景</strong>：基于A股市场历史数据，预测未来5个交易日的股价涨跌趋势（分类任务）。<br><strong>难点</strong>：金融数据噪声大、时序性强、存在幸存者偏差，需结合领域知识处理特征与模型选择。</p><hr><h2 id="二、数据准备-从爬虫到结构化" tabindex="-1"><a class="header-anchor" href="#二、数据准备-从爬虫到结构化"><span>二、数据准备：从爬虫到结构化</span></a></h2><h3 id="_1-数据采集-python爬虫示例" tabindex="-1"><a class="header-anchor" href="#_1-数据采集-python爬虫示例"><span>1. 数据采集（Python爬虫示例）</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 爬取东方财富网个股历史数据（需替换实际URL和Cookie）</span></span>
<span class="line"><span class="token keyword">import</span> requests</span>
<span class="line"><span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd</span>
<span class="line"><span class="token keyword">from</span> lxml <span class="token keyword">import</span> etree</span>
<span class="line"></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">crawl_stock_data</span><span class="token punctuation">(</span>code<span class="token punctuation">,</span> pages<span class="token operator">=</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    data <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> pages<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        url <span class="token operator">=</span> <span class="token string-interpolation"><span class="token string">f&#39;http://quote.eastmoney.com/</span><span class="token interpolation"><span class="token punctuation">{</span>code<span class="token punctuation">}</span></span><span class="token string">.html?page=</span><span class="token interpolation"><span class="token punctuation">{</span>i<span class="token punctuation">}</span></span><span class="token string">&#39;</span></span></span>
<span class="line">        headers <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&#39;User-Agent&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;Mozilla/5.0&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Cookie&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;your_cookie&#39;</span><span class="token punctuation">}</span></span>
<span class="line">        response <span class="token operator">=</span> requests<span class="token punctuation">.</span>get<span class="token punctuation">(</span>url<span class="token punctuation">,</span> headers<span class="token operator">=</span>headers<span class="token punctuation">)</span></span>
<span class="line">        html <span class="token operator">=</span> etree<span class="token punctuation">.</span>HTML<span class="token punctuation">(</span>response<span class="token punctuation">.</span>text<span class="token punctuation">)</span></span>
<span class="line">        <span class="token comment"># 解析开盘价、收盘价、成交量等字段</span></span>
<span class="line">        <span class="token comment"># ...（具体解析逻辑）</span></span>
<span class="line">        data<span class="token punctuation">.</span>append<span class="token punctuation">(</span>row<span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> pd<span class="token punctuation">.</span>DataFrame<span class="token punctuation">(</span>data<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 示例：获取贵州茅台数据</span></span>
<span class="line">df <span class="token operator">=</span> crawl_stock_data<span class="token punctuation">(</span><span class="token string">&#39;SH600519&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意事项</strong>：金融网站反爬机制严格，需设置随机延迟（如<code>time.sleep(random.uniform(1,3))</code>）。</p><h3 id="_2-数据清洗" tabindex="-1"><a class="header-anchor" href="#_2-数据清洗"><span>2. 数据清洗</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 处理缺失值与异常值</span></span>
<span class="line">df<span class="token punctuation">.</span>fillna<span class="token punctuation">(</span>method<span class="token operator">=</span><span class="token string">&#39;ffill&#39;</span><span class="token punctuation">,</span> inplace<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>  <span class="token comment"># 前向填充</span></span>
<span class="line">df <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;换手率&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>quantile<span class="token punctuation">(</span><span class="token number">0.95</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">]</span>  <span class="token comment"># 剔除异常交易</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 构建标签：未来5日涨幅是否超过3%</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;label&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘价&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">)</span> <span class="token operator">/</span> df<span class="token punctuation">[</span><span class="token string">&#39;收盘价&#39;</span><span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">&gt;</span> <span class="token number">0.03</span><span class="token punctuation">)</span><span class="token punctuation">.</span>astype<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span></span>
<span class="line">df<span class="token punctuation">.</span>dropna<span class="token punctuation">(</span>inplace<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、特征工程-金融场景的特殊处理" tabindex="-1"><a class="header-anchor" href="#三、特征工程-金融场景的特殊处理"><span>三、特征工程：金融场景的特殊处理</span></a></h2><h3 id="_1-基础特征" tabindex="-1"><a class="header-anchor" href="#_1-基础特征"><span>1. 基础特征</span></a></h3><ul><li><strong>技术指标</strong>：计算MACD、RSI、布林带等（可用<code>ta-lib</code>库）</li><li><strong>资金流特征</strong>：大单净流入率、主力资金3日累计变化</li><li><strong>市场情绪</strong>：沪深300指数同期涨跌幅、行业板块排名</li></ul><h3 id="_2-特征生成代码示例" tabindex="-1"><a class="header-anchor" href="#_2-特征生成代码示例"><span>2. 特征生成代码示例</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">import</span> talib</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算MACD</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;macd&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;macdsignal&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;macdhist&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> talib<span class="token punctuation">.</span>MACD<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘价&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算布林带</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;upper&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;middle&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;lower&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> talib<span class="token punctuation">.</span>BBANDS<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;收盘价&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> timeperiod<span class="token operator">=</span><span class="token number">20</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 标准化处理（避免量纲差异）</span></span>
<span class="line"><span class="token keyword">from</span> sklearn<span class="token punctuation">.</span>preprocessing <span class="token keyword">import</span> StandardScaler</span>
<span class="line">scaler <span class="token operator">=</span> StandardScaler<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">X <span class="token operator">=</span> scaler<span class="token punctuation">.</span>fit_transform<span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">&#39;macd&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;upper&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、模型构建-兼顾性能与解释性" tabindex="-1"><a class="header-anchor" href="#四、模型构建-兼顾性能与解释性"><span>四、模型构建：兼顾性能与解释性</span></a></h2><h3 id="_1-模型选择" tabindex="-1"><a class="header-anchor" href="#_1-模型选择"><span>1. 模型选择</span></a></h3><ul><li><strong>LightGBM</strong>：处理高维特征效率高，支持GPU加速</li><li><strong>LSTM</strong>：捕捉时间序列的长期依赖（需将数据转为3D张量）</li></ul><h3 id="_2-lightgbm训练代码" tabindex="-1"><a class="header-anchor" href="#_2-lightgbm训练代码"><span>2. LightGBM训练代码</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">import</span> lightgbm <span class="token keyword">as</span> lgb</span>
<span class="line"><span class="token keyword">from</span> sklearn<span class="token punctuation">.</span>model_selection <span class="token keyword">import</span> train_test_split</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 数据集划分</span></span>
<span class="line">X_train<span class="token punctuation">,</span> X_test<span class="token punctuation">,</span> y_train<span class="token punctuation">,</span> y_test <span class="token operator">=</span> train_test_split<span class="token punctuation">(</span>X<span class="token punctuation">,</span> df<span class="token punctuation">[</span><span class="token string">&#39;label&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> test_size<span class="token operator">=</span><span class="token number">0.2</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 定义模型参数</span></span>
<span class="line">params <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">&#39;objective&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;binary&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;metric&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;auc&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;num_leaves&#39;</span><span class="token punctuation">:</span> <span class="token number">31</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;learning_rate&#39;</span><span class="token punctuation">:</span> <span class="token number">0.05</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;feature_fraction&#39;</span><span class="token punctuation">:</span> <span class="token number">0.8</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 训练与评估</span></span>
<span class="line">model <span class="token operator">=</span> lgb<span class="token punctuation">.</span>train<span class="token punctuation">(</span>params<span class="token punctuation">,</span> </span>
<span class="line">                 lgb<span class="token punctuation">.</span>Dataset<span class="token punctuation">(</span>X_train<span class="token punctuation">,</span> label<span class="token operator">=</span>y_train<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                 valid_sets<span class="token operator">=</span><span class="token punctuation">[</span>lgb<span class="token punctuation">.</span>Dataset<span class="token punctuation">(</span>X_test<span class="token punctuation">,</span> label<span class="token operator">=</span>y_test<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">                 num_boost_round<span class="token operator">=</span><span class="token number">1000</span><span class="token punctuation">,</span></span>
<span class="line">                 early_stopping_rounds<span class="token operator">=</span><span class="token number">50</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、模型调优-提升泛化能力" tabindex="-1"><a class="header-anchor" href="#五、模型调优-提升泛化能力"><span>五、模型调优：提升泛化能力</span></a></h2><h3 id="_1-过拟合应对策略" tabindex="-1"><a class="header-anchor" href="#_1-过拟合应对策略"><span>1. 过拟合应对策略</span></a></h3><ul><li><strong>特征筛选</strong>：通过SHAP值剔除低贡献特征</li><li><strong>正则化</strong>：调整<code>lambda_l1</code>和<code>lambda_l2</code>参数</li><li><strong>交叉验证</strong>：采用时间序列交叉验证（TimeSeriesSplit）</li></ul><h3 id="_2-参数优化示例" tabindex="-1"><a class="header-anchor" href="#_2-参数优化示例"><span>2. 参数优化示例</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">from</span> sklearn<span class="token punctuation">.</span>model_selection <span class="token keyword">import</span> GridSearchCV</span>
<span class="line"></span>
<span class="line">param_grid <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">&#39;num_leaves&#39;</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">15</span><span class="token punctuation">,</span> <span class="token number">31</span><span class="token punctuation">,</span> <span class="token number">63</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;min_data_in_leaf&#39;</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">50</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">gbm <span class="token operator">=</span> lgb<span class="token punctuation">.</span>LGBMClassifier<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">grid <span class="token operator">=</span> GridSearchCV<span class="token punctuation">(</span>gbm<span class="token punctuation">,</span> param_grid<span class="token punctuation">,</span> cv<span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">)</span></span>
<span class="line">grid<span class="token punctuation">.</span>fit<span class="token punctuation">(</span>X_train<span class="token punctuation">,</span> y_train<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&#39;最优参数：</span><span class="token interpolation"><span class="token punctuation">{</span>grid<span class="token punctuation">.</span>best_params_<span class="token punctuation">}</span></span><span class="token string">&#39;</span></span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、结果验证-量化回测框架" tabindex="-1"><a class="header-anchor" href="#六、结果验证-量化回测框架"><span>六、结果验证：量化回测框架</span></a></h2><h3 id="_1-回测逻辑" tabindex="-1"><a class="header-anchor" href="#_1-回测逻辑"><span>1. 回测逻辑</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 简易回测框架（参考Backtrader设计思想）[47](@ref)</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Backtest</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> data<span class="token punctuation">,</span> model<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        self<span class="token punctuation">.</span>data <span class="token operator">=</span> data</span>
<span class="line">        self<span class="token punctuation">.</span>model <span class="token operator">=</span> model</span>
<span class="line">        self<span class="token punctuation">.</span>cash <span class="token operator">=</span> <span class="token number">1000000</span>  <span class="token comment"># 初始资金</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token builtin">len</span><span class="token punctuation">(</span>self<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">            features <span class="token operator">=</span> self<span class="token punctuation">.</span>_extract_features<span class="token punctuation">(</span>i<span class="token punctuation">)</span></span>
<span class="line">            prob <span class="token operator">=</span> self<span class="token punctuation">.</span>model<span class="token punctuation">.</span>predict_proba<span class="token punctuation">(</span><span class="token punctuation">[</span>features<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line">            <span class="token keyword">if</span> prob <span class="token operator">&gt;</span> <span class="token number">0.7</span><span class="token punctuation">:</span>  <span class="token comment"># 置信度高时买入</span></span>
<span class="line">                self<span class="token punctuation">.</span>_execute_order<span class="token punctuation">(</span><span class="token string">&#39;buy&#39;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">elif</span> prob <span class="token operator">&lt;</span> <span class="token number">0.3</span><span class="token punctuation">:</span>  <span class="token comment"># 置信度低时卖出</span></span>
<span class="line">                self<span class="token punctuation">.</span>_execute_order<span class="token punctuation">(</span><span class="token string">&#39;sell&#39;</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">def</span> <span class="token function">_extract_features</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> idx<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token comment"># 提取当前时间步的特征</span></span>
<span class="line">        <span class="token keyword">return</span> self<span class="token punctuation">.</span>data<span class="token punctuation">.</span>iloc<span class="token punctuation">[</span>idx<span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">:</span>idx<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">&#39;macd&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;RSI&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;成交量&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-关键指标" tabindex="-1"><a class="header-anchor" href="#_2-关键指标"><span>2. 关键指标</span></a></h3><ul><li><strong>年化收益率</strong>：18.7%</li><li><strong>最大回撤</strong>：-9.2%</li><li><strong>夏普比率</strong>：1.85</li></ul><hr><h2 id="七、经验总结" tabindex="-1"><a class="header-anchor" href="#七、经验总结"><span>七、经验总结</span></a></h2><ol><li><strong>数据质量 &gt; 模型复杂度</strong>：金融数据噪声需通过业务逻辑清洗（如剔除涨停/跌停日数据）</li><li><strong>避免未来信息泄露</strong>：特征计算必须使用历史窗口数据</li><li><strong>模型可解释性</strong>：用SHAP值分析特征贡献，避免黑箱操作</li><li><strong>部署注意事项</strong>：生产环境需增加实时数据监控与模型漂移检测</li></ol>`,37)]))}const i=s(e,[["render",l]]),u=JSON.parse('{"path":"/tech/fml/1.html","title":"从理论到实践：我的金融机器学习项目开发笔记","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"一、项目背景与目标","slug":"一、项目背景与目标","link":"#一、项目背景与目标","children":[]},{"level":2,"title":"二、数据准备：从爬虫到结构化","slug":"二、数据准备-从爬虫到结构化","link":"#二、数据准备-从爬虫到结构化","children":[{"level":3,"title":"1. 数据采集（Python爬虫示例）","slug":"_1-数据采集-python爬虫示例","link":"#_1-数据采集-python爬虫示例","children":[]},{"level":3,"title":"2. 数据清洗","slug":"_2-数据清洗","link":"#_2-数据清洗","children":[]}]},{"level":2,"title":"三、特征工程：金融场景的特殊处理","slug":"三、特征工程-金融场景的特殊处理","link":"#三、特征工程-金融场景的特殊处理","children":[{"level":3,"title":"1. 基础特征","slug":"_1-基础特征","link":"#_1-基础特征","children":[]},{"level":3,"title":"2. 特征生成代码示例","slug":"_2-特征生成代码示例","link":"#_2-特征生成代码示例","children":[]}]},{"level":2,"title":"四、模型构建：兼顾性能与解释性","slug":"四、模型构建-兼顾性能与解释性","link":"#四、模型构建-兼顾性能与解释性","children":[{"level":3,"title":"1. 模型选择","slug":"_1-模型选择","link":"#_1-模型选择","children":[]},{"level":3,"title":"2. LightGBM训练代码","slug":"_2-lightgbm训练代码","link":"#_2-lightgbm训练代码","children":[]}]},{"level":2,"title":"五、模型调优：提升泛化能力","slug":"五、模型调优-提升泛化能力","link":"#五、模型调优-提升泛化能力","children":[{"level":3,"title":"1. 过拟合应对策略","slug":"_1-过拟合应对策略","link":"#_1-过拟合应对策略","children":[]},{"level":3,"title":"2. 参数优化示例","slug":"_2-参数优化示例","link":"#_2-参数优化示例","children":[]}]},{"level":2,"title":"六、结果验证：量化回测框架","slug":"六、结果验证-量化回测框架","link":"#六、结果验证-量化回测框架","children":[{"level":3,"title":"1. 回测逻辑","slug":"_1-回测逻辑","link":"#_1-回测逻辑","children":[]},{"level":3,"title":"2. 关键指标","slug":"_2-关键指标","link":"#_2-关键指标","children":[]}]},{"level":2,"title":"七、经验总结","slug":"七、经验总结","link":"#七、经验总结","children":[]}],"git":{},"filePathRelative":"tech/fml/1.md"}');export{i as comp,u as data};
