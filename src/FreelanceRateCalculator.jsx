import React, { useState, useEffect } from "react";

const FreelanceRateCalculator = () => {
    // Default values for initial state
    const defaultValues = {
        // Section 1: Current Situation
        hoursPerDay: 8,
        daysPerWeek: 5,
        holidays: 10,
        vacationDays: 10,
        sickDays: 8,
        baseCompensation: 65000,
        bonusCompensation: 6500,
        stockValue: 0,
        additionalCompensation: 0,

        // Section 2: Multipliers
        freelanceMultiplier: 1.35,
        estimateMultiplier: 1.2,
        friendsFamilyDiscount: 0.4,
        discountMultiplier: 0.7,

        // Project Calculator
        prepHours: 4,
        workHours: 20,
        revisionHours: 6,
        projectExpenses: 0,
        taxRate: 0,
        rateType: "standard", // standard, friends, mission, probono
    };

    // Function to get saved values from localStorage
    const getSavedValues = () => {
        try {
            const savedValues = localStorage.getItem("freelanceCalculator");
            return savedValues ? JSON.parse(savedValues) : defaultValues;
        } catch (error) {
            console.error("Error loading saved values:", error);
            return defaultValues;
        }
    };

    // Initial state from localStorage or defaults
    const savedValues = getSavedValues();

    // Section 1: Current Situation
    const [hoursPerDay, setHoursPerDay] = useState(savedValues.hoursPerDay);
    const [daysPerWeek, setDaysPerWeek] = useState(savedValues.daysPerWeek);
    const [holidays, setHolidays] = useState(savedValues.holidays);
    const [vacationDays, setVacationDays] = useState(savedValues.vacationDays);
    const [sickDays, setSickDays] = useState(savedValues.sickDays);
    const [baseCompensation, setBaseCompensation] = useState(
        savedValues.baseCompensation,
    );
    const [bonusCompensation, setBonusCompensation] = useState(
        savedValues.bonusCompensation,
    );
    const [stockValue, setStockValue] = useState(savedValues.stockValue);
    const [additionalCompensation, setAdditionalCompensation] = useState(
        savedValues.additionalCompensation,
    );

    // Section 2: Multipliers
    const [freelanceMultiplier, setFreelanceMultiplier] = useState(
        savedValues.freelanceMultiplier,
    );
    const [estimateMultiplier, setEstimateMultiplier] = useState(
        savedValues.estimateMultiplier,
    );
    const [friendsFamilyDiscount, setFriendsFamilyDiscount] = useState(
        savedValues.friendsFamilyDiscount,
    );
    const [discountMultiplier, setDiscountMultiplier] = useState(
        savedValues.discountMultiplier,
    );

    // Project Calculator
    const [prepHours, setPrepHours] = useState(savedValues.prepHours);
    const [workHours, setWorkHours] = useState(savedValues.workHours);
    const [revisionHours, setRevisionHours] = useState(
        savedValues.revisionHours,
    );
    const [projectExpenses, setProjectExpenses] = useState(
        savedValues.projectExpenses,
    );
    const [taxRate, setTaxRate] = useState(savedValues.taxRate);
    const [rateType, setRateType] = useState(savedValues.rateType);

    // Results
    const [currentHourlyRate, setCurrentHourlyRate] = useState(0);
    const [freelanceHourlyRate, setFreelanceHourlyRate] = useState(0);
    const [freelanceDayRate, setFreelanceDayRate] = useState(0);
    const [freelanceWeekRate, setFreelanceWeekRate] = useState(0);
    const [friendsHourlyRate, setFriendsHourlyRate] = useState(0);
    const [friendsDayRate, setFriendsDayRate] = useState(0);
    const [friendsWeekRate, setFriendsWeekRate] = useState(0);
    const [discountHourlyRate, setDiscountHourlyRate] = useState(0);
    const [discountDayRate, setDiscountDayRate] = useState(0);
    const [discountWeekRate, setDiscountWeekRate] = useState(0);

    // UI state
    const [showResetNotification, setShowResetNotification] = useState(false);

    // Section tracker
    const [currentSection, setCurrentSection] = useState(1);

    // Save to localStorage whenever any input changes
    useEffect(() => {
        const valuesForStorage = {
            hoursPerDay,
            daysPerWeek,
            holidays,
            vacationDays,
            sickDays,
            baseCompensation,
            bonusCompensation,
            stockValue,
            additionalCompensation,
            freelanceMultiplier,
            estimateMultiplier,
            friendsFamilyDiscount,
            discountMultiplier,
            prepHours,
            workHours,
            revisionHours,
            projectExpenses,
            taxRate,
            rateType,
        };

        try {
            localStorage.setItem(
                "freelanceCalculator",
                JSON.stringify(valuesForStorage),
            );
            // No notification - silently save
        } catch (error) {
            console.error("Error saving values to localStorage:", error);
        }
    }, [
        hoursPerDay,
        daysPerWeek,
        holidays,
        vacationDays,
        sickDays,
        baseCompensation,
        bonusCompensation,
        stockValue,
        additionalCompensation,
        freelanceMultiplier,
        estimateMultiplier,
        friendsFamilyDiscount,
        discountMultiplier,
        prepHours,
        workHours,
        revisionHours,
        projectExpenses,
        taxRate,
        rateType,
    ]);

    // Calculate rates
    useEffect(() => {
        // Calculate billable hours per year
        const totalDaysOff = holidays + vacationDays + sickDays;
        const workWeeksPerYear = 52;
        const workDaysPerYear = workWeeksPerYear * daysPerWeek - totalDaysOff;
        const billableHoursPerYear = workDaysPerYear * hoursPerDay;

        // Calculate total compensation
        const totalCompensation =
            baseCompensation +
            bonusCompensation +
            stockValue +
            additionalCompensation;

        // Calculate current hourly rate
        const hourlyRate = totalCompensation / billableHoursPerYear;
        setCurrentHourlyRate(hourlyRate);

        // Calculate freelance rates
        const freelanceHourly = hourlyRate * freelanceMultiplier;
        setFreelanceHourlyRate(freelanceHourly);

        // Apply estimate multiplier to day rate (which affects week rate)
        const adjustedHoursPerDay = hoursPerDay * estimateMultiplier;
        setFreelanceDayRate(freelanceHourly * adjustedHoursPerDay);
        setFreelanceWeekRate(
            freelanceHourly * adjustedHoursPerDay * daysPerWeek,
        );

        // Calculate friends and family rates
        setFriendsHourlyRate(freelanceHourly * friendsFamilyDiscount);
        setFriendsDayRate(
            freelanceHourly * friendsFamilyDiscount * adjustedHoursPerDay,
        );
        setFriendsWeekRate(
            freelanceHourly *
                friendsFamilyDiscount *
                adjustedHoursPerDay *
                daysPerWeek,
        );

        // Calculate discount rates
        setDiscountHourlyRate(freelanceHourly * discountMultiplier);
        setDiscountDayRate(
            freelanceHourly * discountMultiplier * adjustedHoursPerDay,
        );
        setDiscountWeekRate(
            freelanceHourly *
                discountMultiplier *
                adjustedHoursPerDay *
                daysPerWeek,
        );
    }, [
        hoursPerDay,
        daysPerWeek,
        holidays,
        vacationDays,
        sickDays,
        baseCompensation,
        bonusCompensation,
        stockValue,
        additionalCompensation,
        freelanceMultiplier,
        estimateMultiplier,
        friendsFamilyDiscount,
        discountMultiplier,
    ]);

    const formatCurrency = (amount) => {
        return amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const nextSection = () => {
        setCurrentSection(currentSection + 1);
    };

    const prevSection = () => {
        setCurrentSection(currentSection - 1);
    };

    // Reset all values to defaults
    const resetToDefaults = () => {
        // Section 1
        setHoursPerDay(defaultValues.hoursPerDay);
        setDaysPerWeek(defaultValues.daysPerWeek);
        setHolidays(defaultValues.holidays);
        setVacationDays(defaultValues.vacationDays);
        setSickDays(defaultValues.sickDays);
        setBaseCompensation(defaultValues.baseCompensation);
        setBonusCompensation(defaultValues.bonusCompensation);
        setStockValue(defaultValues.stockValue);
        setAdditionalCompensation(defaultValues.additionalCompensation);

        // Section 2
        setFreelanceMultiplier(defaultValues.freelanceMultiplier);
        setEstimateMultiplier(defaultValues.estimateMultiplier);
        setFriendsFamilyDiscount(defaultValues.friendsFamilyDiscount);
        setDiscountMultiplier(defaultValues.discountMultiplier);

        // Project Calculator
        setPrepHours(defaultValues.prepHours);
        setWorkHours(defaultValues.workHours);
        setRevisionHours(defaultValues.revisionHours);
        setProjectExpenses(defaultValues.projectExpenses);
        setTaxRate(defaultValues.taxRate);
        setRateType(defaultValues.rateType);

        // Clear localStorage
        localStorage.removeItem("freelanceCalculator");

        // Show reset notification briefly
        setShowResetNotification(true);
        setTimeout(() => {
            setShowResetNotification(false);
        }, 2000);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Reset notification */}
            {showResetNotification && (
                <div className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded shadow-md z-50 transition-all duration-300 transform">
                    <p className="flex items-center">
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Reset to default values
                    </p>
                </div>
            )}

            <h1 className="text-2xl font-serif font-bold text-center mb-6 text-slate-800">
                Freelance Rate Calculator
            </h1>
            <div className="border-t-2 border-b-2 border-slate-800 py-2 mb-6">
                <h2 className="text-lg font-serif text-center text-slate-700">
                    Calculate recommended rates based on your current
                    compensation
                </h2>
            </div>

            {currentSection === 1 && (
                <div>
                    <h2 className="text-lg font-serif font-semibold mb-4 text-slate-800 border-b border-slate-300 pb-2">
                        Current Situation
                    </h2>
                    <p className="mb-4 text-slate-600 text-sm">
                        Enter your current work hours and compensation details.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Hours per day
                            </label>
                            <input
                                type="number"
                                value={hoursPerDay}
                                onChange={(e) =>
                                    setHoursPerDay(
                                        Math.max(1, Number(e.target.value)),
                                    )
                                }
                                className="w-full p-2 border border-slate-300 rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Days per week
                            </label>
                            <input
                                type="number"
                                value={daysPerWeek}
                                onChange={(e) =>
                                    setDaysPerWeek(
                                        Math.max(
                                            1,
                                            Math.min(7, Number(e.target.value)),
                                        ),
                                    )
                                }
                                className="w-full p-2 border border-slate-300 rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Office holidays per year
                            </label>
                            <input
                                type="number"
                                value={holidays}
                                onChange={(e) =>
                                    setHolidays(
                                        Math.max(0, Number(e.target.value)),
                                    )
                                }
                                className="w-full p-2 border border-slate-300 rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Vacation days per year
                            </label>
                            <input
                                type="number"
                                value={vacationDays}
                                onChange={(e) =>
                                    setVacationDays(
                                        Math.max(0, Number(e.target.value)),
                                    )
                                }
                                className="w-full p-2 border border-slate-300 rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Sick days per year
                            </label>
                            <input
                                type="number"
                                value={sickDays}
                                onChange={(e) =>
                                    setSickDays(
                                        Math.max(0, Number(e.target.value)),
                                    )
                                }
                                className="w-full p-2 border border-slate-300 rounded bg-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Base compensation (annual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-600">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={baseCompensation}
                                    onChange={(e) =>
                                        setBaseCompensation(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 pl-8 border border-slate-300 rounded bg-white"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Bonus compensation (annual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-600">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={bonusCompensation}
                                    onChange={(e) =>
                                        setBonusCompensation(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 pl-8 border border-slate-300 rounded bg-white"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Stock/RSUs value (annual)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-600">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={stockValue}
                                    onChange={(e) =>
                                        setStockValue(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 pl-8 border border-slate-300 rounded bg-white"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 mb-1 font-medium">
                                Additional annual compensation
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-600">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={additionalCompensation}
                                    onChange={(e) =>
                                        setAdditionalCompensation(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 pl-8 border border-slate-300 rounded bg-white"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Include any other regular income such as
                                commissions, profit sharing, stipends, overtime
                                pay, per diems, allowances, or other benefits
                                with monetary value not captured above.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={resetToDefaults}
                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition-colors font-medium text-sm"
                        >
                            Reset to Defaults
                        </button>
                        <button
                            onClick={nextSection}
                            className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors font-medium"
                        >
                            Next: Rate Multipliers
                        </button>
                    </div>
                </div>
            )}

            {currentSection === 2 && (
                <div>
                    <h2 className="text-lg font-serif font-semibold mb-4 text-slate-800 border-b border-slate-300 pb-2">
                        Rate Multipliers
                    </h2>
                    <p className="mb-4 text-slate-600 text-sm">
                        Adjust multipliers that affect your calculated freelance
                        rates.
                    </p>

                    <div className="mb-6 bg-white p-4 border border-slate-200 rounded">
                        <label className="block text-slate-700 mb-1 font-medium">
                            Freelancing Multiplier:{" "}
                            {freelanceMultiplier.toFixed(2)}
                        </label>
                        <p className="text-sm text-slate-500 mb-2">
                            Accounts for taxes, healthcare, non-billable hours,
                            and business expenses (Range: 1.2 to 1.5)
                        </p>
                        <input
                            type="range"
                            min="1.2"
                            max="1.5"
                            step="0.01"
                            value={freelanceMultiplier}
                            onChange={(e) =>
                                setFreelanceMultiplier(Number(e.target.value))
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>1.2</span>
                            <span>1.5</span>
                        </div>
                    </div>

                    <div className="mb-6 bg-white p-4 border border-slate-200 rounded">
                        <label className="block text-slate-700 mb-1 font-medium">
                            Estimate Multiplier: {estimateMultiplier.toFixed(2)}
                        </label>
                        <p className="text-sm text-slate-500 mb-2">
                            Buffer for inaccurate time estimates in day/week
                            rates. (Range: 1.0 to 1.5)
                        </p>
                        <input
                            type="range"
                            min="1.0"
                            max="1.5"
                            step="0.01"
                            value={estimateMultiplier}
                            onChange={(e) =>
                                setEstimateMultiplier(Number(e.target.value))
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>1.0</span>
                            <span>1.5</span>
                        </div>
                    </div>

                    <div className="mb-6 bg-white p-4 border border-slate-200 rounded">
                        <label className="block text-slate-700 mb-1 font-medium">
                            Friends & Family Discount:{" "}
                            {Math.round((1 - friendsFamilyDiscount) * 100)}% off
                        </label>
                        <p className="text-sm text-slate-500 mb-2">
                            Discount percentage for friends and family (applied
                            to your standard rate)
                        </p>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.01"
                            value={1 - friendsFamilyDiscount}
                            onChange={(e) =>
                                setFriendsFamilyDiscount(
                                    1 - Number(e.target.value),
                                )
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>10% off</span>
                            <span>90% off</span>
                        </div>
                    </div>

                    <div className="mb-6 bg-white p-4 border border-slate-200 rounded">
                        <label className="block text-slate-700 mb-1 font-medium">
                            Mission-Based Discount:{" "}
                            {Math.round((1 - discountMultiplier) * 100)}% off
                        </label>
                        <p className="text-sm text-slate-500 mb-2">
                            Discount for nonprofits and organizations with
                            limited budgets (applied to your standard rate)
                        </p>
                        <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.01"
                            value={1 - discountMultiplier}
                            onChange={(e) =>
                                setDiscountMultiplier(
                                    1 - Number(e.target.value),
                                )
                            }
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>10% off</span>
                            <span>90% off</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <div>
                            <button
                                onClick={prevSection}
                                className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300 transition-colors font-medium mr-2"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition-colors font-medium text-sm"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                        <button
                            onClick={nextSection}
                            className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors font-medium"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            )}

            {currentSection === 3 && (
                <div>
                    <h2 className="text-lg font-serif font-semibold mb-4 text-slate-800 border-b border-slate-300 pb-2">
                        Calculated Rates
                    </h2>

                    <div className="mb-8 bg-white p-4 border border-slate-200 rounded">
                        <h3 className="font-serif font-medium text-slate-800 text-base mb-2">
                            Current Compensation
                        </h3>
                        <p className="text-slate-600 text-sm mb-2">
                            Based on your inputs:
                        </p>
                        <div className="bg-slate-100 p-3 rounded">
                            <p className="font-medium text-slate-700">
                                {formatCurrency(currentHourlyRate)} per hour
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Calculated from total compensation divided by
                                actual billable hours
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-serif font-medium text-slate-800 text-base mb-3">
                            Standard Freelance Rates
                        </h3>
                        <div className="bg-white p-4 rounded border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Hourly Rate
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(freelanceHourlyRate)}
                                    </p>
                                </div>
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Day Rate
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(freelanceDayRate)}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Includes time buffer of{" "}
                                        {Math.round(
                                            (estimateMultiplier - 1) * 100,
                                        )}
                                        %
                                    </p>
                                </div>
                                <div className="p-3">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Weekly Rate
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(freelanceWeekRate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-serif font-medium text-slate-800 text-base mb-3">
                            Friends & Family Rates (
                            {Math.round((1 - friendsFamilyDiscount) * 100)}%
                            discount)
                        </h3>
                        <div className="bg-white p-4 rounded border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Hourly
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(friendsHourlyRate)}
                                    </p>
                                </div>
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Day Rate
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(friendsDayRate)}
                                    </p>
                                </div>
                                <div className="p-3">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Weekly
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(friendsWeekRate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-serif font-medium text-slate-800 text-base mb-3">
                            Mission-Based Rates (
                            {Math.round((1 - discountMultiplier) * 100)}%
                            discount)
                        </h3>
                        <div className="bg-white p-4 rounded border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Hourly
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(discountHourlyRate)}
                                    </p>
                                </div>
                                <div className="p-3 border-r border-slate-200">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Day Rate
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(discountDayRate)}
                                    </p>
                                </div>
                                <div className="p-3">
                                    <p className="text-slate-600 text-sm uppercase tracking-wide">
                                        Weekly
                                    </p>
                                    <p className="text-xl font-serif font-bold text-slate-800">
                                        {formatCurrency(discountWeekRate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 mb-6 bg-slate-100 p-4 rounded border border-slate-200">
                        <h3 className="font-serif font-medium text-slate-800 mb-2">
                            Important Note
                        </h3>
                        <p className="text-slate-700 text-sm">
                            When offering discounted rates, always communicate
                            your standard rates to maintain transparency about
                            the value being delivered.
                        </p>
                    </div>

                    <div className="mt-8 mb-6 bg-white p-4 rounded border border-slate-200">
                        <h3 className="font-serif font-medium text-slate-800 mb-4 border-b border-slate-200 pb-2">
                            Project Cost Estimator
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Preparation Hours
                                </label>
                                <input
                                    type="number"
                                    value={prepHours}
                                    onChange={(e) =>
                                        setPrepHours(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 border border-slate-300 rounded bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Work Hours
                                </label>
                                <input
                                    type="number"
                                    value={workHours}
                                    onChange={(e) =>
                                        setWorkHours(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 border border-slate-300 rounded bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Revision Hours
                                </label>
                                <input
                                    type="number"
                                    value={revisionHours}
                                    onChange={(e) =>
                                        setRevisionHours(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 border border-slate-300 rounded bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Additional Expenses ($)
                                </label>
                                <input
                                    type="number"
                                    value={projectExpenses}
                                    onChange={(e) =>
                                        setProjectExpenses(
                                            Math.max(0, Number(e.target.value)),
                                        )
                                    }
                                    className="w-full p-2 border border-slate-300 rounded bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) =>
                                        setTaxRate(
                                            Math.max(
                                                0,
                                                Math.min(
                                                    100,
                                                    Number(e.target.value),
                                                ),
                                            ),
                                        )
                                    }
                                    className="w-full p-2 border border-slate-300 rounded bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 mb-1 font-medium">
                                    Rate Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={rateType}
                                        onChange={(e) =>
                                            setRateType(e.target.value)
                                        }
                                        className="w-full p-2 pl-4 pr-10 border border-slate-300 rounded bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                                    >
                                        <option
                                            value="standard"
                                            className="py-2"
                                        >
                                            Standard Rate
                                        </option>
                                        <option
                                            value="friends"
                                            className="py-2"
                                        >
                                            Friends & Family Rate (
                                            {Math.round(
                                                (1 - friendsFamilyDiscount) *
                                                    100,
                                            )}
                                            % off)
                                        </option>
                                        <option
                                            value="mission"
                                            className="py-2"
                                        >
                                            Mission-Based Rate (
                                            {Math.round(
                                                (1 - discountMultiplier) * 100,
                                            )}
                                            % off)
                                        </option>
                                        <option
                                            value="probono"
                                            className="py-2"
                                        >
                                            Pro Bono (expenses only)
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>

                                    {/* Color indicator based on rate type */}
                                    <div
                                        className="absolute inset-y-0 left-0 w-2 rounded-l"
                                        style={{
                                            backgroundColor:
                                                rateType === "standard"
                                                    ? "#334155"
                                                    : rateType === "friends"
                                                      ? "#6366f1"
                                                      : rateType === "mission"
                                                        ? "#22c55e"
                                                        : "#f97316",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100 p-3 rounded mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Total Project Hours:
                                    </p>
                                    <p className="font-medium text-slate-700">
                                        {prepHours + workHours + revisionHours}{" "}
                                        hours
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Hourly Rate Applied:
                                    </p>
                                    <p
                                        className={`font-medium ${
                                            rateType === "standard"
                                                ? "text-slate-700"
                                                : rateType === "friends"
                                                  ? "text-indigo-600"
                                                  : rateType === "mission"
                                                    ? "text-green-600"
                                                    : "text-orange-600"
                                        }`}
                                    >
                                        {rateType === "standard" &&
                                            formatCurrency(freelanceHourlyRate)}
                                        {rateType === "friends" &&
                                            formatCurrency(friendsHourlyRate)}
                                        {rateType === "mission" &&
                                            formatCurrency(discountHourlyRate)}
                                        {rateType === "probono" && "$0"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Labor Cost:
                                    </p>
                                    <p className="font-medium text-slate-700">
                                        {rateType === "standard" &&
                                            formatCurrency(
                                                freelanceHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours),
                                            )}
                                        {rateType === "friends" &&
                                            formatCurrency(
                                                friendsHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours),
                                            )}
                                        {rateType === "mission" &&
                                            formatCurrency(
                                                discountHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours),
                                            )}
                                        {rateType === "probono" && "$0"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Additional Expenses:
                                    </p>
                                    <p className="font-medium text-slate-700">
                                        {formatCurrency(projectExpenses)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Subtotal:
                                    </p>
                                    <p className="font-medium text-slate-700">
                                        {rateType === "standard" &&
                                            formatCurrency(
                                                freelanceHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses,
                                            )}
                                        {rateType === "friends" &&
                                            formatCurrency(
                                                friendsHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses,
                                            )}
                                        {rateType === "mission" &&
                                            formatCurrency(
                                                discountHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses,
                                            )}
                                        {rateType === "probono" &&
                                            formatCurrency(projectExpenses)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-600 text-sm">
                                        Tax ({taxRate}%):
                                    </p>
                                    <p className="font-medium text-slate-700">
                                        {rateType === "standard" &&
                                            formatCurrency(
                                                (freelanceHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (taxRate / 100),
                                            )}
                                        {rateType === "friends" &&
                                            formatCurrency(
                                                (friendsHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (taxRate / 100),
                                            )}
                                        {rateType === "mission" &&
                                            formatCurrency(
                                                (discountHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (taxRate / 100),
                                            )}
                                        {rateType === "probono" &&
                                            formatCurrency(
                                                projectExpenses *
                                                    (taxRate / 100),
                                            )}
                                    </p>
                                </div>

                                <div className="md:col-span-2 border-t border-slate-300 pt-2 mt-2">
                                    <p className="text-slate-600 text-sm font-medium">
                                        TOTAL PROJECT COST:
                                    </p>
                                    <p
                                        className={`text-xl font-serif font-bold ${
                                            rateType === "standard"
                                                ? "text-slate-800"
                                                : rateType === "friends"
                                                  ? "text-indigo-700"
                                                  : rateType === "mission"
                                                    ? "text-green-700"
                                                    : "text-orange-700"
                                        }`}
                                    >
                                        {rateType === "standard" &&
                                            formatCurrency(
                                                (freelanceHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (1 + taxRate / 100),
                                            )}
                                        {rateType === "friends" &&
                                            formatCurrency(
                                                (friendsHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (1 + taxRate / 100),
                                            )}
                                        {rateType === "mission" &&
                                            formatCurrency(
                                                (discountHourlyRate *
                                                    (prepHours +
                                                        workHours +
                                                        revisionHours) +
                                                    projectExpenses) *
                                                    (1 + taxRate / 100),
                                            )}
                                        {rateType === "probono" &&
                                            formatCurrency(
                                                projectExpenses *
                                                    (1 + taxRate / 100),
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded mt-4 border border-slate-200">
                            <p className="text-slate-600 text-sm mb-1">
                                Note about taxes:
                            </p>
                            <p className="text-xs text-slate-500">
                                This calculator applies tax to the entire
                                billable amount (labor + expenses). Tax
                                requirements vary by location and business type.
                                Consult with a tax professional about your
                                specific situation.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <div>
                            <button
                                onClick={prevSection}
                                className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300 transition-colors font-medium mr-2"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition-colors font-medium text-sm"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                        <button
                            onClick={() => setCurrentSection(1)}
                            className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 transition-colors font-medium"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}

            {/* Claude badge */}
            <div className="mt-8 text-center">
                <div className="inline-flex items-center bg-[#F2816F] text-white text-xs px-2 py-1 rounded-md shadow-sm">
                    <span className="opacity-90 mr-1">
                        vibe coded with claude
                    </span>
                    <span className="text-sm">😬</span>
                </div>
            </div>
        </div>
    );
};

export default FreelanceRateCalculator;
