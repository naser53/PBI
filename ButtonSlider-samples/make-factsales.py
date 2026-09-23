"""Generate FactSales.csv for the Button Slider demo with a CAMEL-shaped
monthly sales profile (peaks and troughs), not a flat/balanced series.

Columns:
  ID           - integer identity, starting at 1
  PurchaseDate - date (YYYY-MM-DD), covering every date in DimDate
  Amount       - multiple of 500 in [1000, 9000], all divisible by 500

Approach:
  Each calendar month (YYYY-MM) gets a "level" multiplier describing how
  strong sales are that month, forming a camel profile:
    good, good, less, less, less, good again, very bad, ...
  Daily amounts are drawn around that month's level so the MONTHLY TOTAL
  follows the desired humps and dips. Consecutive months differ, with some
  pairs ~+10% / ~-10% of each other.
"""
import csv
import random

DIMDATE = r"C:\Users\Naser.Daneshi\PBI\ButtonSlider-samples\DimDate.csv"
OUT = r"C:\Users\Naser.Daneshi\PBI\ButtonSlider-samples\FactSales.csv"

random.seed(42)  # reproducible

# Read DateKeys (date only)
dates = []
with open(DIMDATE, encoding="utf-8-sig", newline="") as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        if row and row[0].strip():
            dates.append(row[0].split(" ")[0])  # YYYY-MM-DD

# Distinct months in order
months = []
for d in dates:
    ym = d[:7]  # YYYY-MM
    if ym not in months:
        months.append(ym)

# Camel profile levels per month (relative strength).
# Pattern: 2 good, 3 less, 1 good again, 1 very bad, then repeat/vary.
# Values are relative "target average amount" per sale for that month.
# ~10% step relationships appear between several neighbours.
base_pattern = [
    7800,  # good  (hump 1)
    7000,  # good  (~10% less than prev)
    3200,  # less  (trough)
    3520,  # less  (~10% more than prev)
    2880,  # less  (~ -18%)
    7600,  # good again (hump 2)
    1400,  # very bad (deep dip)
]

# Build a per-month level by cycling the pattern with mild jitter so it
# doesn't look mechanical, while preserving the camel shape.
month_level = {}
for i, ym in enumerate(months):
    base = base_pattern[i % len(base_pattern)]
    jitter = random.uniform(0.95, 1.05)  # +/-5% wobble
    month_level[ym] = base * jitter

amount_choices = list(range(1000, 9001, 500))  # 1000..9000 step 500

def snap_to_500(x):
    """Round x to nearest multiple of 500, clamp to [1000, 9000]."""
    v = int(round(x / 500.0)) * 500
    return max(1000, min(9000, v))

rows = []
next_id = 1
for d in dates:
    ym = d[:7]
    level = month_level[ym]
    # 1-3 sales per day; each sale drawn around the month level with noise
    for _ in range(random.randint(1, 3)):
        raw = random.gauss(level, level * 0.20)  # 20% daily noise
        amount = snap_to_500(raw)
        rows.append((next_id, d, amount))
        next_id += 1

with open(OUT, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["ID", "PurchaseDate", "Amount"])
    w.writerows(rows)

# Validation + monthly summary
amounts = [r[2] for r in rows]
assert all(a % 500 == 0 for a in amounts)
assert all(1000 <= a <= 9000 for a in amounts)

monthly = {}
for _id, d, amt in rows:
    monthly[d[:7]] = monthly.get(d[:7], 0) + amt

print(f"wrote {len(rows)} rows; distinct dates {len(set(r[1] for r in rows))}/{len(dates)}")
print("monthly totals (camel profile):")
prev = None
for ym in months:
    tot = monthly[ym]
    delta = "" if prev is None else f"  ({(tot/prev-1)*100:+.0f}% vs prev)"
    print(f"  {ym}: {tot:>8}{delta}")
    prev = tot
