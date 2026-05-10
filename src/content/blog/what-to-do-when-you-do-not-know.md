---
title: "What to do when you do not know"
description: "On robust optimization, adjustable robust optimization, distributionally robust optimization, and the discipline of writing down what you don't know."
date: 2026-05-10T12:00:00Z
tags: ["operations research", "optimization", "research methods"]
---

Most optimization problems are written as if the world were known. You specify a cost vector, a constraint matrix, a right-hand side, and you minimize. The textbook problem reads

$$\min_x \ c^\top x \quad \text{s.t.} \quad Ax \leq b, \ x \geq 0,$$

and the algorithms that solve it have been refined for seventy years. What gets less attention is the quiet lie inside this formulation. The parameters $c$, $A$, and $b$ are written as if known. In practice they are estimates: forecasts of demand, guesses at travel times, projections of next quarter's case counts. The "optimal" solution is optimal for one realization of a parameter you guessed.

Robust optimization begins from this admission. It does not pretend the parameters are known. It asks what to do anyway.

The basic move is to replace each uncertain parameter with a set of plausible values and solve against the worst case in that set. If $u$ denotes the uncertainty and $\mathcal{U}$ is the set of values it might take, the robust counterpart of an optimization problem is

$$\min_x \ \max_{u \in \mathcal{U}} f(x, u) \quad \text{s.t.} \quad g(x, u) \leq 0 \ \ \forall u \in \mathcal{U}.$$

The decision variable $x$ is chosen first; the adversary then picks the cruelest $u$ in $\mathcal{U}$; you want your decision to be good against that cruelty. The earliest version of this idea, due to Soyster (1973), simply protected against every possible perturbation of the constraint matrix simultaneously. The solutions were so conservative they were rarely useful. The framework lay mostly dormant for two decades.

What revived it was a shift in how people thought about $\mathcal{U}$. Ben-Tal and Nemirovski (1998, 1999) showed that if you constrain the uncertainty to lie in an ellipsoid rather than a box, the resulting robust counterpart of a linear program becomes a second-order cone program, which is convex and tractable. Bertsimas and Sim (2004) introduced the budgeted uncertainty set, in which at most $\Gamma$ parameters can deviate from their nominal values at once, which preserves linearity entirely. The choice of uncertainty set is not merely a technical detail. It is a worldview. A box says: anything in this range, independently. An ellipsoid says: deviations are correlated and large joint deviations are unlikely. A budget says: at most $\Gamma$ things go wrong at once.

This is the first place I find robust optimization beautiful. The uncertainty set is the real modeling object. The optimization is almost downstream of it. Most of the intellectual work, the part where you have to know something about the actual problem, is deciding what you are willing to call possible. Once $\mathcal{U}$ is fixed, the math takes over.

The second piece of beauty is the tractability miracle. You might expect that hedging against an entire infinite set of adversaries would be computationally hopeless. It is not. For an ellipsoidal $\mathcal{U} = \{u : \|u\|_2 \leq \rho\}$, the inner maximization

$$\max_{\|u\|_2 \leq \rho} (a + Pu)^\top x$$

admits a closed form: it equals $a^\top x + \rho \|P^\top x\|_2$. The robust constraint becomes a single second-order cone inequality. The infinite adversary collapses to a finite, convex problem. This is not a small thing. Caution, properly formulated, turns out to be computable. The fact that you can write down "I want this to hold no matter what, within reason" and have it become a conic program is the kind of result that changes what you think optimization is for.

The third piece is adjustability. Static robust optimization commits all decisions before any uncertainty resolves. This is rarely how the world works. You order before you know demand, but you reroute after. You stockpile before an outbreak, but you reallocate during one. Adjustable robust optimization, introduced by Ben-Tal et al. (2004) and surveyed comprehensively by Yanıkoğlu, Gorissen, and den Hertog (2019), splits decisions into here-and-now variables $x$ and wait-and-see variables $y(u)$ that depend on the realized uncertainty. The exact problem is generally intractable, but affine decision rules of the form $y(u) = y_0 + Yu$ recover convexity and often suffice in practice. A model that cannot represent the difference between "decide now" and "decide later" will overstockpile, overprovision, overcommit. Adjustability is the formal way of saying that not all flexibility has to be sacrificed at the altar of robustness.

I have spent the past year building one of these models. The setting is the antimicrobial supply chain in Botswana, where the Central Medical Stores must decide how to allocate stock across 631 health facilities under demand that is driven by epidemiological dynamics no one can forecast precisely. The here-and-now decision is procurement and pre-positioning. The wait-and-see decision is reallocation between districts as outbreaks unfold. The uncertainty set encodes plausible epidemic trajectories from a coupled two-strain SEIR model, calibrated against historical case data. Writing the model was the easy part. The hard part was deciding what counted as a plausible outbreak, which is to say, deciding what $\mathcal{U}$ should contain. That decision determined everything downstream. The math did not give it to me. The math waited until I had committed to a worldview, and then it was generous.

This brings me to what I think is the deepest move in the field, which is the turn from robust optimization to distributionally robust optimization.

The robust framework treats $u$ as adversarial within $\mathcal{U}$. But where did $\mathcal{U}$ come from? Often, from a guess about the support of an underlying distribution. We are pretending the unknown is the realization, when really the unknown is the distribution itself. Distributionally robust optimization promotes this honesty. Instead of an uncertainty set over realizations, it considers an ambiguity set over distributions:

$$\min_x \ \sup_{\mathbb{P} \in \mathcal{P}} \ \mathbb{E}_{\mathbb{P}}[f(x, \xi)].$$

Now $\mathcal{P}$ is a set of distributions, and the adversary picks the one that maximizes expected cost. The choice of $\mathcal{P}$ is again a worldview. Moment-based ambiguity sets (Delage and Ye, 2010) say "I know the mean and covariance, but not the shape." Wasserstein ambiguity sets (Mohajerin Esfahani and Kuhn, 2018) say something more interesting: "the true distribution is within transport distance $\varepsilon$ of the empirical one I observed."

The Wasserstein formulation is, to my eye, the most beautiful object in this landscape. It unifies stochastic optimization and robust optimization as endpoints of a single continuum. When $\varepsilon = 0$, the ambiguity set collapses to the empirical distribution and you recover sample average approximation. As $\varepsilon$ grows, the set absorbs more distributional possibilities until, in the limit, you recover something like classical robust optimization over the support. The radius $\varepsilon$ is the dial between trusting your data and hedging against its possible wrongness. Recent work, including Selvi and collaborators (2025), has pushed this further by intersecting Wasserstein balls with auxiliary distributions, which lets you pull in side information without giving up the framework's guarantees. The same authors' finite-sample work (Selvi and Wiesemann, 2026) has begun to address the curse of dimensionality that long haunted these methods.

I want to be careful about what I mean by beauty here. I do not mean that the formulations are pretty in the way a clean proof is pretty, though some of them are. I mean that they are honest. They make you write down what you do not know, in a form the math can see. They refuse the convenient fiction that your point estimate is the truth. They give you back, in exchange for that honesty, decisions that survive contact with a world that was always going to surprise you.

The thread running through all of this is that robust optimization, adjustable robust optimization, and distributionally robust optimization are answers to the same question. What should I do when I do not know? They differ only in what they take the unknown to be. A parameter, a worst case, a distribution. Choosing among them is a modeling act, not a technical one. The mathematics of the field is the most refined I know for handling that act with discipline. That, I think, is what makes it beautiful.
