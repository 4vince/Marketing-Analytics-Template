# Admin chat agent — business intelligence assistant that answers questions using live store context.
from .base import ChatAgent, ChatContext, ChatResponse


class AdminChatAgent(ChatAgent):
    """Business intelligence assistant for the admin panel.

    Answers questions about products, orders, revenue, traffic, campaigns,
    SEO, and analytics using business context passed in from the live database.
    """

    async def respond(self, message: str, context: ChatContext) -> ChatResponse:
        system = self._build_system_prompt(context)
        return await self._chat_with_llm(system, message)

    @staticmethod
    def _build_system_prompt(context: ChatContext) -> str:
        """Build a system prompt from the business context records."""
        parts = [
            "You are a business intelligence assistant for an e-commerce store admin panel.",
            "You help store admins understand their products, orders, revenue, and analytics.",
            "Answer concisely and base your answers on the data provided below.",
            "If you don't know something or the data isn't available, say so.",
        ]

        context_data = context.product_catalog or []
        for record in context_data:
            record_type = record.get("type", "")
            if record_type == "product_performance":
                cats = record.get("categories", [])
                cat_lines = ", ".join(
                    f"{c.get('name', '?')}: {c.get('count', 0)} (${c.get('avgPrice', 0)} avg)"
                    for c in cats
                )
                parts.append(
                    f"\nProducts: {record.get('total_products', 0)} total "
                    f"({record.get('active_products', 0)} active). "
                    f"Categories: {cat_lines}."
                )
            elif record_type == "order_funnel":
                funnel = record.get("funnel", [])
                lines = [f"\nOrder funnel (count + revenue by status):"]
                for f in funnel:
                    lines.append(
                        f"  - {f.get('status', '?')}: {f.get('count', 0)} orders, "
                        f"${f.get('revenue', 0):.2f}"
                    )
                parts.append("".join(lines))
            elif record_type == "revenue_trends":
                row = record
                parts.append(
                    f"\nRevenue: ${row.get('total_revenue', 0):.2f} total "
                    f"across {row.get('total_orders', 0)} orders. "
                    f"Last 7 days: ${row.get('revenue_last_7_days', 0):.2f}. "
                    f"AOV: ${row.get('avg_order_value', '0')}."
                )
                daily = row.get("daily_revenue", [])
                if daily:
                    sample = daily[-7:] if len(daily) > 7 else daily
                    trend = ", ".join(
                        f"{d.get('date', '')[-5:]}=${d.get('revenue', 0):.0f}"
                        for d in sample
                    )
                    parts.append(f"  Daily revenue (recent): {trend}")
                orders_daily = row.get("daily_orders", [])
                if orders_daily:
                    sample = orders_daily[-7:] if len(orders_daily) > 7 else orders_daily
                    trend = ", ".join(
                        f"{d.get('date', '')[-5:]}={d.get('orders', 0)}"
                        for d in sample
                    )
                    parts.append(f"  Daily orders (recent): {trend}")
            elif record_type == "traffic_sources":
                sources = record.get("sources", [])
                lines = [f"\nTraffic sources (last 30 days):"]
                for s in sources:
                    lines.append(
                        f"  - {s.get('source', '?')}: {s.get('visits', 0)} visits, "
                        f"{s.get('orders', 0)} orders, ${s.get('revenue', '0')} revenue"
                    )
                parts.append("".join(lines))
            elif record_type == "campaign_performance":
                campaigns = record.get("campaigns", [])
                lines = [f"\nCampaigns (last 30 days):"]
                for c in campaigns:
                    lines.append(
                        f"  - {c.get('name', '?')} ({c.get('channel', '?')}): "
                        f"spent ${c.get('spend', '0')}, "
                        f"{c.get('impressions', 0)} impressions, "
                        f"{c.get('clicks', 0)} clicks, "
                        f"{c.get('conversions', 0)} conversions, "
                        f"${c.get('revenue', '0')} revenue, "
                        f"ROAS {c.get('roas', '0')}x"
                    )
                parts.append("".join(lines))
            elif record_type == "search_query_data":
                queries = record.get("queries", [])
                lines = [f"\nTop search queries (last 30 days):"]
                for q in queries:
                    pos = q.get("avg_position")
                    pos_str = f", avg position {pos}" if pos else ""
                    lines.append(
                        f"  - \"{q.get('query', '?')}\": "
                        f"{q.get('impressions', 0)} impressions, "
                        f"{q.get('clicks', 0)} clicks{pos_str}"
                    )
                parts.append("".join(lines))
            elif record_type == "seo_rankings":
                keywords = record.get("keywords", [])
                lines = [f"\nSEO rankings (latest positions):"]
                for k in keywords:
                    lines.append(
                        f"  - \"{k.get('keyword', '?')}\": "
                        f"position {k.get('position', '?')}, "
                        f"page \"{k.get('page', '?')}\", "
                        f"volume {k.get('search_volume', 0)}"
                    )
                parts.append("".join(lines))
            elif record_type == "top_products":
                products = record.get("products", [])
                lines = [f"\nTop products by revenue (last 30 days):"]
                for p in products:
                    lines.append(
                        f"  - {p.get('name', '?')}: "
                        f"${p.get('revenue', 0):.2f} ({p.get('quantity', 0)} units)"
                    )
                parts.append("".join(lines))

            # ── Legacy record types ────────────────────────────────────────────
            elif record_type == "product_summary":
                parts.append(
                    f"\nProducts: {record.get('total', 'N/A')} total "
                    f"({record.get('active', 'N/A')} active) "
                    f"across {record.get('categories', 'N/A')} categories."
                )
            elif record_type == "order_summary":
                parts.append(
                    f"\nOrders: {record.get('total', 'N/A')} total. "
                    f"Latest: {record.get('latest', 'N/A')}."
                )
            elif record_type == "revenue":
                parts.append(
                    f"\nRevenue: ${record.get('total', 0):.2f} total "
                    f"across {record.get('order_count', 0)} orders."
                )
            elif record_type == "recent_orders":
                orders = record.get("orders", [])
                if orders:
                    lines = [f"\nRecent orders:"]
                    for o in orders:
                        lines.append(
                            f"  - {o.get('id', '')[:8]}: {o.get('customer', '')} "
                            f"${o.get('total', 0):.2f} ({o.get('status', '')})"
                        )
                    parts.append("".join(lines))
            elif record_type == "analysis_summary":
                scores = record.get("average_scores", {})
                if scores:
                    lines = [f"\nAnalysis scores (average by agent):"]
                    for agent, score in scores.items():
                        lines.append(f"  - {agent}: {score}/100")
                    parts.append("".join(lines))
            elif record_type == "recent_reports":
                reports = record.get("reports", [])
                if reports:
                    lines = [f"\nLatest quarterly reports:"]
                    for r in reports[:3]:
                        lines.append(
                            f"  - {r.get('period', '')}: "
                            f"score {r.get('score', 'N/A')}/100"
                        )
                    parts.append("".join(lines))

        return "\n".join(parts)
