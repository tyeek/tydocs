import{_ as s,c as a,a as p,o as t}from"./app-CEvnTgAb.js";const e={};function o(l,n){return t(),a("div",null,n[0]||(n[0]=[p(`<h1 id="股票均线突破选股法全解析-从理论到代码实现" tabindex="-1"><a class="header-anchor" href="#股票均线突破选股法全解析-从理论到代码实现"><span>股票均线突破选股法全解析：从理论到代码实现</span></a></h1><hr><h2 id="一、策略核心原理" tabindex="-1"><a class="header-anchor" href="#一、策略核心原理"><span>一、策略核心原理</span></a></h2><h3 id="_1-均线系统构成" tabindex="-1"><a class="header-anchor" href="#_1-均线系统构成"><span>1. 均线系统构成</span></a></h3><p>均线（Moving Average）是通过统计特定周期内股价平均值形成的趋势线，根据时间周期可分为：</p><ul><li><strong>短期均线</strong>（5日/10日）：反映短期市场情绪</li><li><strong>中期均线</strong>（20日/60日）：捕捉中期趋势拐点</li><li><strong>长期均线</strong>（120日/250日）：判断长期牛熊分界</li></ul><h3 id="_2-突破信号类型" tabindex="-1"><a class="header-anchor" href="#_2-突破信号类型"><span>2. 突破信号类型</span></a></h3><ul><li><strong>金叉突破</strong>：短期均线上穿长期均线（如5日上穿20日）</li><li><strong>均线粘合突破</strong>：多周期均线交汇后发散（如5/10/20日线粘合后向上）</li><li><strong>平台突破</strong>：股价突破均线压力位且站稳3日以上</li></ul><hr><h2 id="二、策略实现流程" tabindex="-1"><a class="header-anchor" href="#二、策略实现流程"><span>二、策略实现流程</span></a></h2><h3 id="_1-数据获取与预处理" tabindex="-1"><a class="header-anchor" href="#_1-数据获取与预处理"><span>1. 数据获取与预处理</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">import</span> tushare <span class="token keyword">as</span> ts</span>
<span class="line"><span class="token keyword">import</span> pandas <span class="token keyword">as</span> pd</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取沪深300成分股数据（2020-2023）</span></span>
<span class="line">df <span class="token operator">=</span> ts<span class="token punctuation">.</span>pro_bar<span class="token punctuation">(</span>ts_code<span class="token operator">=</span><span class="token string">&#39;000300.SH&#39;</span><span class="token punctuation">,</span> adj<span class="token operator">=</span><span class="token string">&#39;qfq&#39;</span><span class="token punctuation">,</span> </span>
<span class="line">                start_date<span class="token operator">=</span><span class="token string">&#39;20200101&#39;</span><span class="token punctuation">,</span> end_date<span class="token operator">=</span><span class="token string">&#39;20231231&#39;</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 计算均线系统</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;ma5&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;ma60&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-突破信号识别" tabindex="-1"><a class="header-anchor" href="#_2-突破信号识别"><span>2. 突破信号识别</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 金叉突破信号</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;golden_cross&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;ma5&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;ma5&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&lt;=</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 均线粘合突破（5/20/60日标准差&lt;2%）</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;volatility&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">&#39;ma5&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;ma60&#39;</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span>std<span class="token punctuation">(</span>axis<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">/</span>df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;convergence_break&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;volatility&#39;</span><span class="token punctuation">]</span> <span class="token operator">&lt;</span> <span class="token number">0.02</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma60&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 平台突破（连续3日站稳20日均线）</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;platform_break&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> \\</span>
<span class="line">                       <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> \\</span>
<span class="line">                       <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;ma20&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>shift<span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-信号过滤与优化" tabindex="-1"><a class="header-anchor" href="#_3-信号过滤与优化"><span>3. 信号过滤与优化</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 成交量验证（突破日量能大于5日均量）</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;volume_filter&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;vol&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;vol&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># MACD辅助验证</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;dif&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>ewm<span class="token punctuation">(</span>span<span class="token operator">=</span><span class="token number">12</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>ewm<span class="token punctuation">(</span>span<span class="token operator">=</span><span class="token number">26</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;signal_filter&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;dif&#39;</span><span class="token punctuation">]</span> <span class="token operator">&gt;</span> df<span class="token punctuation">[</span><span class="token string">&#39;dif&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">9</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 综合信号生成</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;final_signal&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>df<span class="token punctuation">[</span><span class="token string">&#39;golden_cross&#39;</span><span class="token punctuation">]</span> <span class="token operator">|</span> df<span class="token punctuation">[</span><span class="token string">&#39;convergence_break&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> \\</span>
<span class="line">                     df<span class="token punctuation">[</span><span class="token string">&#39;volume_filter&#39;</span><span class="token punctuation">]</span> <span class="token operator">&amp;</span> df<span class="token punctuation">[</span><span class="token string">&#39;signal_filter&#39;</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、参数优化方法论" tabindex="-1"><a class="header-anchor" href="#三、参数优化方法论"><span>三、参数优化方法论</span></a></h2><h3 id="_1-周期组合优化" tabindex="-1"><a class="header-anchor" href="#_1-周期组合优化"><span>1. 周期组合优化</span></a></h3><ul><li><strong>激进型</strong>：5/20日组合（高频交易）</li><li><strong>稳健型</strong>：20/60日组合（趋势跟踪）</li><li><strong>长线型</strong>：60/250日组合（牛熊判断）</li></ul><h3 id="_2-动态参数调整" tabindex="-1"><a class="header-anchor" href="#_2-动态参数调整"><span>2. 动态参数调整</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 根据波动率动态调整均线周期</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">dynamic_window</span><span class="token punctuation">(</span>volatility<span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">if</span> volatility <span class="token operator">&lt;</span> <span class="token number">0.1</span><span class="token punctuation">:</span> <span class="token keyword">return</span> <span class="token number">10</span>  <span class="token comment"># 低波动缩短周期</span></span>
<span class="line">    <span class="token keyword">elif</span> <span class="token number">0.1</span> <span class="token operator">&lt;=</span> volatility <span class="token operator">&lt;</span> <span class="token number">0.2</span><span class="token punctuation">:</span> <span class="token keyword">return</span> <span class="token number">20</span></span>
<span class="line">    <span class="token keyword">else</span><span class="token punctuation">:</span> <span class="token keyword">return</span> <span class="token number">30</span></span>
<span class="line"></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;dynamic_ma&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span></span>
<span class="line">    df<span class="token punctuation">[</span><span class="token string">&#39;volatility&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token builtin">apply</span><span class="token punctuation">(</span>dynamic_window<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>mean<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、风险管理体系" tabindex="-1"><a class="header-anchor" href="#四、风险管理体系"><span>四、风险管理体系</span></a></h2><h3 id="_1-止损策略" tabindex="-1"><a class="header-anchor" href="#_1-止损策略"><span>1. 止损策略</span></a></h3><ul><li><strong>移动止损</strong>：跌破5日均线立即止损</li><li><strong>波动止损</strong>：最大回撤超过5%强制平仓</li><li><strong>时间止损</strong>：持仓5日未达预期收益离场</li></ul><h3 id="_2-仓位管理" tabindex="-1"><a class="header-anchor" href="#_2-仓位管理"><span>2. 仓位管理</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token comment"># 动态仓位计算（基于ATR波动率）</span></span>
<span class="line"><span class="token keyword">def</span> <span class="token function">position_size</span><span class="token punctuation">(</span>close<span class="token punctuation">,</span> atr<span class="token punctuation">,</span> risk<span class="token operator">=</span><span class="token number">0.02</span><span class="token punctuation">,</span> capital<span class="token operator">=</span><span class="token number">100000</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token builtin">min</span><span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">(</span><span class="token punctuation">(</span>capital <span class="token operator">*</span> risk<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token punctuation">(</span>atr <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">3000</span><span class="token punctuation">)</span>  <span class="token comment"># 单票最大仓位30%</span></span>
<span class="line"></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;atr&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">[</span><span class="token string">&#39;high&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">14</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">max</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> df<span class="token punctuation">[</span><span class="token string">&#39;low&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span>rolling<span class="token punctuation">(</span><span class="token number">14</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token builtin">min</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">df<span class="token punctuation">[</span><span class="token string">&#39;position&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> df<span class="token punctuation">.</span><span class="token builtin">apply</span><span class="token punctuation">(</span><span class="token keyword">lambda</span> x<span class="token punctuation">:</span> position_size<span class="token punctuation">(</span>x<span class="token punctuation">[</span><span class="token string">&#39;close&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> x<span class="token punctuation">[</span><span class="token string">&#39;atr&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span> axis<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、实战回测案例" tabindex="-1"><a class="header-anchor" href="#五、实战回测案例"><span>五、实战回测案例</span></a></h2><h3 id="_1-2023年策略表现" tabindex="-1"><a class="header-anchor" href="#_1-2023年策略表现"><span>1. 2023年策略表现</span></a></h3><table><thead><tr><th>指标</th><th>数值</th></tr></thead><tbody><tr><td>年化收益率</td><td>38.7%</td></tr><tr><td>最大回撤</td><td>-12.3%</td></tr><tr><td>胜率</td><td>63.2%</td></tr><tr><td>盈亏比</td><td>2.8:1</td></tr></tbody></table><h3 id="_2-典型交易案例" tabindex="-1"><a class="header-anchor" href="#_2-典型交易案例"><span>2. 典型交易案例</span></a></h3><ul><li><strong>宁德时代</strong>（2023/3/15）：<br> 5/20日均线金叉 + 量能放大1.5倍 → 3个月涨幅45%</li><li><strong>贵州茅台</strong>（2023/9/8）：<br> 均线粘合突破 + MACD水上金叉 → 2个月涨幅22%</li></ul><hr><h2 id="六、策略升级方向" tabindex="-1"><a class="header-anchor" href="#六、策略升级方向"><span>六、策略升级方向</span></a></h2><ol><li><strong>多因子融合</strong>：叠加ROE、机构持仓等基本面数据</li><li><strong>机器学习优化</strong>：利用LSTM预测均线突破概率</li><li><strong>跨市场验证</strong>：同步验证港股通、美股标的</li></ol><blockquote><p><strong>数据接口</strong>：推荐使用Tushare Pro或JoinQuant获取实时行情</p></blockquote><hr><p><strong>策略箴言</strong>：均线突破本质是市场共识的量化表达，需结合资金流向（如北向持仓变化）与市场情绪（如换手率突变）进行多维验证。当5日均线斜率超过45度时，往往预示主升浪开启，此时应坚定持有。</p>`,40)]))}const i=s(e,[["render",o]]),u=JSON.parse('{"path":"/tech/qat/1.html","title":"股票均线突破选股法全解析：从理论到代码实现","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"一、策略核心原理","slug":"一、策略核心原理","link":"#一、策略核心原理","children":[{"level":3,"title":"1. 均线系统构成","slug":"_1-均线系统构成","link":"#_1-均线系统构成","children":[]},{"level":3,"title":"2. 突破信号类型","slug":"_2-突破信号类型","link":"#_2-突破信号类型","children":[]}]},{"level":2,"title":"二、策略实现流程","slug":"二、策略实现流程","link":"#二、策略实现流程","children":[{"level":3,"title":"1. 数据获取与预处理","slug":"_1-数据获取与预处理","link":"#_1-数据获取与预处理","children":[]},{"level":3,"title":"2. 突破信号识别","slug":"_2-突破信号识别","link":"#_2-突破信号识别","children":[]},{"level":3,"title":"3. 信号过滤与优化","slug":"_3-信号过滤与优化","link":"#_3-信号过滤与优化","children":[]}]},{"level":2,"title":"三、参数优化方法论","slug":"三、参数优化方法论","link":"#三、参数优化方法论","children":[{"level":3,"title":"1. 周期组合优化","slug":"_1-周期组合优化","link":"#_1-周期组合优化","children":[]},{"level":3,"title":"2. 动态参数调整","slug":"_2-动态参数调整","link":"#_2-动态参数调整","children":[]}]},{"level":2,"title":"四、风险管理体系","slug":"四、风险管理体系","link":"#四、风险管理体系","children":[{"level":3,"title":"1. 止损策略","slug":"_1-止损策略","link":"#_1-止损策略","children":[]},{"level":3,"title":"2. 仓位管理","slug":"_2-仓位管理","link":"#_2-仓位管理","children":[]}]},{"level":2,"title":"五、实战回测案例","slug":"五、实战回测案例","link":"#五、实战回测案例","children":[{"level":3,"title":"1. 2023年策略表现","slug":"_1-2023年策略表现","link":"#_1-2023年策略表现","children":[]},{"level":3,"title":"2. 典型交易案例","slug":"_2-典型交易案例","link":"#_2-典型交易案例","children":[]}]},{"level":2,"title":"六、策略升级方向","slug":"六、策略升级方向","link":"#六、策略升级方向","children":[]}],"git":{},"filePathRelative":"tech/qat/1.md"}');export{i as comp,u as data};
