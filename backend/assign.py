import random
from config import supabase

# 1. Fetch all apartments (id & name)
all_apts = (
    supabase
      .table("apartments")
      .select("id, name")
      .execute()
).data

# sanity check
if len(all_apts) < 90:
    raise ValueError(f"Not enough apartments ({len(all_apts)}) to assign 75 total.")

# 2. Sample 75 random apartments
sampled = random.sample(all_apts, 90)

# 3. Your team members (replace with real names)
team_members = ["Hamza", "Vincent ", "Jamie ", "Katherine ", "Saarth", "Manushri"]

# 4. Chunk into 5 groups of 15 and map to each member
assignments = {
    member: sampled[i*15:(i+1)*15]
    for i, member in enumerate(team_members)
}

# 5. Output
for member, group in assignments.items():
    print(f"\nTasks for {member} (15 apartments):")
    for apt in group:
        print(f" • ID {apt['id']}: {apt['name']}")
